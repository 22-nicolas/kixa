import { useCart } from "../../customHooks/CartProvider";
import styles from "../../styles/cart.module.css"
import { shoeAssetsPath } from "../../modules/utils";
import { Link } from "react-router-dom";

export default function Cart() {
    const {cart, removeFromCart} = useCart()

    const items = cart.map(item => {
        const {id, name, price, color, size, quantity} = item
        return(
            <div key={`${id}${color}${size}`} className={styles.item}>
                <div className={styles.flex}>
                    <div className={styles.imgContainer}><img src={`${shoeAssetsPath}/${id}/${id}_${color + 1}_1.png`}/></div>
                    <div className="item-info">
                        <Link to={`/item?id=${id}&c=${color}&size=${size}`}>{name}</Link>
                        <p className="color-size">{color}, EU {size}</p>
                    </div>
                    <p className="item-qty">Qty {quantity}</p>
                    <p className="price">US ${price*quantity}</p>
                </div>
                <p className={styles.removeBtn} onMouseDown={() => removeFromCart(id, color, size)}>Remove</p>
            </div>
        )
    })

    return(
        <div className={styles.cartList}>
            {items}
        </div>
    )
}