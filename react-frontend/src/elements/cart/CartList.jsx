import { useCart } from "../../customHooks/CartProvider";
import styles from "../../styles/cart.module.css"
import CartItem from "./CartItem";

export default function Cart() {
    const {cart} = useCart()

    const items = cart.map(itemData => {
        const key = `${itemData.id}${itemData.color}${itemData.size}`
        return <CartItem itemData={itemData} key={key} />
    })

    return(
        <div className={styles.cartList}>
            {items}
        </div>
    )
}