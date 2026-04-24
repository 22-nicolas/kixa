import { Router } from "express";
import { validateCart, getPayPalAccessToken, checkoutTypes, handleCompleteCheckout } from "../../modules/checkout.js";
import { createOrder, getOrderById, updateOrderStatus } from "../../sql/orders.js";
import { sendConfirmationEmail } from "../../modules/nodemail.js";

const router = Router();

router.post("/create/paypal", async (req, res) => {
    try {
        const { items, currency } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        let totalAmount = 0;
        const lineItems = await validateCart(items, currency, checkoutTypes.PAYPAL)

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

    handleCompleteCheckout(captureData, checkoutTypes.PAYPAL);
});

export default router;