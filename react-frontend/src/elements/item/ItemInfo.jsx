import { ItemDataContext } from "../../pages/Item"
import { useContext, useState, createContext } from "react"
import styles from "../../styles/item.module.css"
import cart_icon from "../../assets/cart_icon.png"
import { shoeAssetsPath } from "../../modules/utils"
import { useCart } from "../../customHooks/CartProvider"
import { useSearchParams } from "react-router-dom"

export default function ItemInfo() {
    const [itemData] = useContext(ItemDataContext)
    const [searchParams] = useSearchParams()
    const [activeSize, setActiveSize] = useState(Number(searchParams.get("size")) || null)
    const {addToCart} = useCart()
    
    if (!itemData) return <h1>Loading...</h1>

    const sizeSelectors = itemData.sizes.map(size => <SizeSelector key={size} size={size} activeSize={activeSize} setActiveSize={setActiveSize}/>)
    const colorSelectors = itemData.colors.map((color, i) => <ColorSelector key={i} colorId={color} i={i}/>)
    
    return(
        <div className={styles.itemInfo}>
            <div>
                <h1>{itemData.name}</h1>
                <p>{itemData.description}</p>  
                <div className={styles.colorways}>
                    {colorSelectors}
                </div>
                <p className={styles.sizeSelectLabel}>Select Size</p>
                <div className={styles.sizeSelect}>
                    {sizeSelectors}
                </div>
                <p className={styles.price}>{itemData.price}$</p>
                <div onMouseDown={() => addToCart(itemData.id, itemData.color, activeSize)} className={styles.addCartButton}>
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

function ColorSelector({ i, colorId }) {
    const [itemData, setItemData] = useContext(ItemDataContext)
    const isActive = itemData.color === i

    return(
        <div className={`${styles.colorway} ${isActive ? styles.active : ""}`} onClick={() => setItemData(prevItemData => ({
            ...prevItemData,
            color: i
        }))}>
            <img src={`${shoeAssetsPath}/${itemData.id}/${itemData.id}_${i+1}_1.png`}/>
        </div>
    )
}