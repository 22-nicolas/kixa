import { Router } from "express";
import paypalCheckoutRoutes from "./paypalCheckout.js";
import stripeCheckoutRoutes from "./stripeCheckout.js";

const router = Router();

router.use("/", paypalCheckoutRoutes);
router.use("/", stripeCheckoutRoutes);

export default router;