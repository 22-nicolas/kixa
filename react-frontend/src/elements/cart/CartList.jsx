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

            {/* Toast for stock updates */}
            <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
                <div id="stockToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <strong className="me-auto">Inventory Update</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div className="toast-body">
                    </div>
                </div>
            </div>
        </div>
    )
}