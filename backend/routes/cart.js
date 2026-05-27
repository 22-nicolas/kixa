import { Router } from "express";
import { getProductStock } from "../sql/products.js";
import { validateCart } from "../modules/checkout.js";

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

router.post("/validate-cart", async (req, res) => {
    const { cart, currency } = req.body;

    try {
        await validateCart(cart, currency);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).send();
});


export default router;