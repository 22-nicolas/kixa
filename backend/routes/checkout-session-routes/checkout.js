import { Router } from "express";
import paypalCheckoutRoutes from "./paypalCheckout.js";
import stripeCheckoutRoutes from "./stripeCheckout.js";

const router = Router();

router.use("/create-payment-session", paypalCheckoutRoutes, stripeCheckoutRoutes);

export default router;