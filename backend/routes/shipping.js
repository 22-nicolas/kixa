import { Router } from "express";
import { getShippingCost } from "../sql/shipping.js";

const router = Router();

router.get("/:country_code", async (req, res) => {
    const country_code = req.params.country_code;
    const shippingCost = await getShippingCost(country_code);
    if (!shippingCost) {
        return res.status(404).send("Shipping cost not found for the specified country");
    }
    res.status(200).send({ cost: shippingCost });
});

export default router;