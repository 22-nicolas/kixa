import { useEffect, useState } from "react";
import { useCart } from "../../customHooks/CartProvider";
import styles from "../../styles/cart.module.css"

export default function Reciept() {
    const {cart, getQuantity} = useCart()
    const [quantity, setQuantity] = useState(0)
    const [itemsPrice, setItemsPrice] = useState(0)
    const shipping = 10
    
    useEffect(() => {
        setQuantity(getQuantity())
        setItemsPrice(prevPrice => {
            let price = 0
            cart.forEach(item => {
                price += Number(item.price)
            });
            return price
        })
    }, [cart])

    

    return (
        <div className={styles.reciept}>
            <div>
                <p>Items ({quantity})</p>
                <p>US ${itemsPrice}</p>
            </div>
            <div>
                <p>Shipping</p>
                <p>US $10</p>
            </div>
            <div>
                <p>Discounts</p>
                <p>US $0</p>
            </div>
            <div className={styles.subtotal}>
                <p>Subtotal</p>
                <p>US ${itemsPrice+shipping}</p>
            </div>
            <div className={styles.checkoutBtn}><p>Go to checkout</p></div>
        </div>
    )
}