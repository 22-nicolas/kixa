import { Router } from "express";
import stripeCheckoutRoutes from "./stripeCheckout.js";
import { validateForm, validateForms } from "../../modules/validateForms.js";
import { createOrder, createOrderId } from "../../sql/orders.js";
import { validateCart } from "../../modules/checkout.js";

const router = Router();

router.use("/create-payment-session", stripeCheckoutRoutes);

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

router.post("/create-order", async (req, res) => {
    const { cartItems,addressForm } = req.body;

    // Validate the address form
    const validateError = await validateForm(addressForm, validateForms.address);
    if (validateError) {
        if (validateError === "Invalid validation form") {
            return res.status(400).send("Internal Server error: Invalid validation form");
        }
        res.status(400).send(validateError);
        return;
    }
    
    // Validate and build line items using database prices to prevent tampering
    const {orderItems} = await validateCart(cartItems, "USD")


    const orderId = await createOrderId();
    await createOrder({
        id: orderId,
        items: orderItems,
        address: addressForm,
    });

    res.status(200).send({ orderId });
});

export default router;