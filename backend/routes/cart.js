import { Router } from "express";
import { getProductStock } from "../sql/products.js";
import Stripe from 'stripe';
import { getConversionRates } from "./currency.js";
import { supportedCountries } from "shared";

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

router.post("/create-checkout-session", async (req, res) => {
    try {
        const { items, currency } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // Validate and build line items using database prices
        const lineItems = await Promise.all(
            items.map(async (item) => {
                // Authoritative lookup from DB to prevent tampering
                const stockData = await getProductStock(item.id, item.color, item.size);
                const conversionRates = await getConversionRates();
                let convertedPrice = stockData.price;
                //console.log({currency, conversionRate: conversionRates["eur"], price: stockData.price})
                if (currency && conversionRates && stockData) {
                    const usdPrice = Number(stockData.price) / conversionRates["EUR"]
                    convertedPrice = Number((conversionRates[currency] * usdPrice).toFixed(2))
                    //console.log({convertedPrice, conversionRate: conversionRates[currency], currency, conversionRates})
                }

                const toLowercaseCurrency = currency?.toLowerCase();
                
                return {
                    price_data: {
                        currency: toLowercaseCurrency || "eur",
                        product_data: {
                            name: item.name,
                        },
                        // Stripe expects unit_amount in cents (integer)
                        unit_amount: Math.round(Number(convertedPrice) * 100),
                    },
                    quantity: item.quantity,
                };
            })
        );

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

export default router;