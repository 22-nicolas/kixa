import { Router } from "express";
import { getProductStock } from "../sql/products.js";
import Stripe from 'stripe';
import { getConversionRates } from "./currency.js";
import { supportedCountries, checkoutTypes } from "shared";
import { createOrder, getOrderById, updateOrderStatus } from "../sql/orders.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = Router();

router.post("/resolve", async (req, res) => {
    const cart = req.body;
    
    const newCart = await Promise.all(
        cart?.map(async (cartItem) => {
            const stockData = await getProductStock(cartItem.id, cartItem.color, cartItem.size);
            const {price} = stockData;

            return {
                ...cartItem,
                price
            }
        })
    );

    res.send(newCart);
});

router.post("/create-checkout-session/stripe", async (req, res) => {
    try {
        const { items, currency } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // Validate and build line items using database prices
        const lineItems = await validateCart(items, currency, checkoutTypes.STRIPE);

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: supportedCountries,
            },
            success_url: `${process.env.FRONTEND_URL}/kixa/#/success`, // Redirect here after payment
            cancel_url: `${process.env.FRONTEND_URL}/kixa/#/cart`,  // Redirect here if they click back
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe session error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/create-checkout-session/paypal", async (req, res) => {
    try {
        const { items, currency } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        let totalAmount = 0;
        const lineItems = await validateCart(items, currency, checkoutTypes.PAYPAL)
        console.log(lineItems)
        // Validate and build line items using database prices to prevent tampering
        for (const item of lineItems) {
            totalAmount += item.unit_amount.value * item.quantity;
        }

        const accessToken = await getPayPalAccessToken();

        const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency?.toUpperCase() || "EUR",
                            value: totalAmount.toFixed(2),
                            breakdown: {
                                item_total: {
                                    currency_code: currency?.toUpperCase() || "EUR",
                                    value: totalAmount.toFixed(2),
                                },
                            },
                        },
                        items: lineItems,
                    },
                ],
                application_context: {
                    return_url: `${process.env.FRONTEND_URL}/kixa/#/success`,
                    cancel_url: `${process.env.FRONTEND_URL}/kixa/#/cart`,
                },
            }),
        });

        const order = await response.json();
        const approvalUrl = order.links?.find((link) => link.rel === "approve")?.href;

        if (!approvalUrl) {
            throw new Error("Failed to create PayPal checkout session");
        }
        
        await createOrder({
            id: order.id,
            items: lineItems,
        })

        res.json({ url: approvalUrl });
    } catch (error) {
        console.error("PayPal session error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/success/paypal", async (req, res) => {
    const { orderToken } = req.body;
    const accessToken = await getPayPalAccessToken();

    const captureResponse = await fetch(
        `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderToken}/capture`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const captureData = await captureResponse.json();

    const { id, status } = captureData;

    if (status !== "COMPLETED") return

    // Check if order already exists to prevent duplicate emails/orders
    const order = await getOrderById(id);
    if (order?.status === "payed") return


    await updateOrderStatus(id, "payed")
});

export default router;

async function getPayPalAccessToken() {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    const data = await response.json();
    return data.access_token;
}

async function validateCart(items, currency, checkoutType) {
    const conversionRates = await getConversionRates();

    const lineItems = await Promise.all(
        items.map(async (item) => {
            if (!Array.isArray(items)) throw new Error("Invalid items");
            if (item.quantity <= 0) throw new Error("Invalid quantity");
           
            const stockData = await getProductStock(item.id, item.color, item.size);
            

            let price = stockData.price;
            if (currency && conversionRates && stockData) {
                price = convertPrice(stockData.price, currency, conversionRates)
            }
            
            //check stock
            if (stockData.stock < item.quantity) {
                throw new Error(`${item.name} - Out of stock or quantity exceeded stock`);
            }


            if (checkoutType === checkoutTypes.STRIPE) {
                return {
                    price_data: {
                        currency: currency?.toLowerCase() || "eur",
                        product_data: {
                            name: item.name,
                        },
                        // Stripe expects unit_amount in cents (integer)
                        unit_amount: Math.round(Number(price) * 100),
                    },
                    quantity: item.quantity,
                };
            } else if(checkoutType === checkoutTypes.PAYPAL) {
                return {
                    name: item.name,
                    unit_amount: {
                        currency_code: currency?.toUpperCase() || "EUR",
                        value: price,
                    },
                    quantity: item.quantity.toString(),
                }
            }
        })
    )

    return lineItems;
}

function convertPrice(price, currency, conversionRates) {
    const usdPrice = Number(price) / conversionRates["EUR"]
    const convertedPrice = Number((conversionRates[currency] * usdPrice).toFixed(2))

    return convertedPrice
}