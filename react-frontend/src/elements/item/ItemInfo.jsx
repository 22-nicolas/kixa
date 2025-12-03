import { ItemDataContext } from "../../pages/Item"
import { useContext, useState, createContext } from "react"
import styles from "../../styles/item.module.css"
import cart_icon from "../../assets/cart_icon.png"

export default function ItemInfo() {
    const itemData = useContext(ItemDataContext)
    const [activeSize, setActiveSize] = useState(null)

    if (!itemData) return <h1>Loading...</h1>

    const sizeSelectors = itemData.sizes.map(size => <SizeSelector key={size} size={size} activeSize={activeSize} setActiveSize={setActiveSize}/>)

    return(
        <div className={styles.itemInfo}>
            <div>
                <h1>{itemData.name}</h1>
                <p>{itemData.description}</p>  
                <div className={styles.colorways}>

                </div>
                <p className={styles.sizeSelectLabel}>Select Size</p>
                <div className={styles.sizeSelect}>
                    {sizeSelectors}
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

function SizeSelector({ size, activeSize, setActiveSize }) {
    const isActive = activeSize === size

    return <div className={`${styles.size} ${isActive ? styles.active : ""}`} onClick={() => setActiveSize(size)}>EU {size}</div>
}