import { ItemDataContext } from "../../pages/Item"
import { useContext, useState, createContext } from "react"
import styles from "../../styles/item.module.css"
import cart_icon from "../../assets/cart_icon.png"
import { shoeAssetsPath } from "../../modules/utils"
import { useCart } from "../../customHooks/CartProvider"
import { useSearchParams } from "react-router-dom"
import { CurrencyContext } from "../../customHooks/CurrencyProvider"
import { getConversionRates } from "../../api/currency"
import { useEffect } from "react"

export default function ItemInfo() {
    const [itemData] = useContext(ItemDataContext)
    const [searchParams] = useSearchParams()
    const [activeSize, setActiveSize] = useState(Number(searchParams.get("size")) || null)
    const {addToCart} = useCart()
    const {currency} = useContext(CurrencyContext)
    const [conversionRates, setConversionRates] = useState(null)

    useEffect(() => { 
        fetchConversionRates()
    }, [currency])

    async function fetchConversionRates() {
        const rates = await getConversionRates()
        setConversionRates(rates)
    }

    if (!itemData) return <h1>Loading...</h1>

    const sizeSelectors = itemData.sizes.map(size => <SizeSelector key={size} size={size} activeSize={activeSize} setActiveSize={setActiveSize}/>)
    const colorSelectors = itemData.colors.map((color, i) => <ColorSelector key={i} colorId={color} i={i}/>)
    
    const [show] = useState(window.visualViewport.width > 992)

    let convertedPrice

    if (conversionRates) {
        const usdPrice = itemData.price / conversionRates["EUR"]
        convertedPrice = (conversionRates[currency] * usdPrice).toFixed(2)
    }

    return(
        <div className={styles.itemInfo}>
            <div>
                <h1>{itemData.name}</h1>
                <p>{itemData.description}</p>  
                <div className={styles.colorways}>
                    {colorSelectors}
                </div>
                <p className={`${styles.sizeSelectLabel} `} id="sizeSelectLabel" type="button" data-bs-toggle="collapse" data-bs-target="#sizeSelectDropdown" aria-controls="sizeSelectDropdown" aria-expanded="false" aria-label="Toggle size selector">Select Size</p>
                <div className={`${styles.sizeSelect} ${show ? "show" : ""} row collapse justify-content-center`} id="sizeSelectDropdown">
                    {sizeSelectors}
                </div>
                <p className={styles.price}>{convertedPrice ? convertedPrice : "..."} {currency}</p>
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

    function handleClick() {
        setActiveSize(size)
        const sizeSelectLabel = document.getElementById("sizeSelectLabel")
        if (sizeSelectLabel) {
            sizeSelectLabel.style.color = "black"
        }
    }

    return <div className={`${styles.size} ${isActive ? styles.active : ""} col-5 col-lg-3 m-1 p-1`} onClick={handleClick}>EU {size}</div>
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