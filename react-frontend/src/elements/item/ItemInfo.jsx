import { ItemDataContext } from "../../pages/Item"
import { useContext } from "react"
import styles from "../../styles/item.module.css"
import cart_icon from "../../assets/cart_icon.png"

export default function ItemInfo() {
    const itemData = useContext(ItemDataContext)
    if (!itemData) return <h1>Loading...</h1>

    return(
        <div className={styles.itemInfo}>
            <div>
                <h1>{itemData.name}</h1>
                <p>{itemData.description}</p>  
                <div className={styles.colorways}>
                    
                </div>
                <p className={styles.sizeSelectLabel}>Select Size</p>
                <div className={styles.sizeSelect}>
                </div>
                <p className={styles.price}>{itemData.price}$</p>
                <div className={styles.addCartButton}>
                    <p>Add to cart</p>
                    <img src={cart_icon}/>
                </div>
            </div>
        </div> 
    )
}