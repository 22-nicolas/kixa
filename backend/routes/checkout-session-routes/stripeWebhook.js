import express from "express";
import Stripe from "stripe";
import { sendConfirmationEmail } from "../../modules/nodemail.js";
import { updateOrderStatus } from "../../sql/orders.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhookRouter = express.Router();

// Stripe requires raw body for signature verification
webhookRouter.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      try {
        const session = event.data.object;

        const id = session.metadata.orderId;
        session.id = id;
        sendConfirmationEmail(session)
    
        await updateOrderStatus(id, "payed")
      } catch (error) {
        console.error("Error processing checkout session:", error);
      }
    }

    res.json({ received: true });
  }
);

export default webhookRouter;