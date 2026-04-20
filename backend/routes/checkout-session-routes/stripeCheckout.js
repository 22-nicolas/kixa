import { Router } from "express";
import Stripe from "stripe";
import { validateCart, checkoutTypes } from "../../modules/checkout.js";
import { supportedCountries } from "shared";
import { createOrder, createOrderId } from "../../sql/orders.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = Router();

router.post("/create/stripe", async (req, res) => {
    try {
        const { items, currency } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // Validate and build line items using database prices
        const lineItems = await validateCart(items, currency, checkoutTypes.STRIPE);

        const orderId = await createOrderId();

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: supportedCountries,
            },
            metadata: {
                orderId: orderId,
            },
            success_url: `${process.env.FRONTEND_URL}/kixa/#/success`, // Redirect here after payment
            cancel_url: `${process.env.FRONTEND_URL}/kixa/#/cart`,  // Redirect here if they click back
        });

        await createOrder({
            id: orderId,
            items: lineItems,
        })

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe session error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;