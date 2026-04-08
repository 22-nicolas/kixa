import { useEffect, useState } from "react";
import { useCart } from "../../customHooks/CartProvider";
import styles from "../../styles/cart.module.css"
import CartItem from "./CartItem";

export default function Cart() {
    const { cart, resolveCart } = useCart()
    const [ items, setItems ] = useState([])

    useEffect(() => {
        loadItems()
    }, [cart])

    async function loadItems() {
        const resolvedCart = await resolveCart()
        console.log(resolvedCart)
        const items = resolvedCart.map(itemData => {
            const key = `${itemData.id}${itemData.color}${itemData.size}`
            return <CartItem itemData={itemData} key={key} />
        })

        setItems(items)
    }

    return(
        <div className={styles.cartList}>
            {items}
        </div>
    )
}