import { Router } from "express";
import paypalCheckoutRoutes from "./paypalCheckout.js";
import stripeCheckoutRoutes from "./stripeCheckout.js";
import { validateForm, validateForms } from "../../modules/validateForms.js";

const router = Router();

router.use("/create-payment-session", paypalCheckoutRoutes, stripeCheckoutRoutes);

router.post("/validate-address-form", async (req, res) => {
    const formData = req.body;
    const validateError = await validateForm(formData, validateForms.address);
    if (validateError) {
        if (validateError === "Invalid validation form") {
            return res.status(400).send("Internal Server error: Invalid validation form");
        }
        res.status(400).send(validateError);
        return;
    }
    res.status(200).send();
});

export default router;