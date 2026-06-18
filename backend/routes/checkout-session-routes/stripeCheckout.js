import { Router } from "express";
import Stripe from "stripe";
import { validateCart, convertPrice } from "../../modules/checkout.js";
import { supportedCountries } from "shared";
import { createOrder, createOrderId } from "../../sql/orders.js";
import { getConversionRates } from "../currency.js";
import { getShippingCost } from "../../sql/shipping.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { items, currency, shippingCountry } = req.body;

        if (!supportedCountries.includes(shippingCountry)) {
            return res.status(400).json({ error: "Unsupported shipping country" });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // Validate and build line items using database prices
        const {lineItems, orderItems} = await validateCart(items, currency, true);

        const shippingCost = await getShippingCost(shippingCountry);
        const conversionRates = await getConversionRates();
        const convertedShippingCost = Math.round(Number(convertPrice(shippingCost, currency, conversionRates)) * 100);

        lineItems.push({
            price_data: {
                currency: currency?.toLowerCase() || "eur",
                product_data: {
                    name: "Shipping",
                },
                // Stripe expects unit_amount in cents (integer)
                unit_amount: convertedShippingCost,
            },
            quantity: 1,
        });

        const orderId = await createOrderId();

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: [shippingCountry],
            },
            metadata: {
                orderId: orderId,
            },
            success_url: `${process.env.FRONTEND_URL}/kixa/#/success`, // Redirect here after payment
            cancel_url: `${process.env.FRONTEND_URL}/kixa/#/cart`,  // Redirect here if they click back
        });

        await createOrder({
            id: orderId,
            items: orderItems,
        })

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe session error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;