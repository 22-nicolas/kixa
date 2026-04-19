import { Router } from "express";
import { getProductStock } from "../sql/products.js";

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

export default router;