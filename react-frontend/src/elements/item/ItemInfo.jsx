import { ActiveColorContext, ItemDataContext } from "../../pages/Item"
import { useContext, useState, useEffect } from "react"
import styles from "../../styles/item.module.css"
import cart_icon from "../../assets/cart_icon.png"
import { notNil, shoeAssetsPath } from "../../modules/utils"
import { useCart } from "../../customHooks/CartProvider"
import { useSearchParams } from "react-router-dom"
import { CurrencyContext } from "../../customHooks/CurrencyProvider"

export default function ItemInfo() {
    const [itemData] = useContext(ItemDataContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const [activeSize, setActiveSize] = useState(getSizeFromParams())
    const [activeColor] = useContext(ActiveColorContext)
    const {addToCart} = useCart()
    const {currency, conversionRates} = useContext(CurrencyContext)
    const [convertedPrice, setConvertedPrice] = useState(null)


    useEffect(() => { 
        changeSize(getSizeFromParams())
    }, [searchParams])

    useEffect(() => { 
        handlePrice()
    }, [currency, conversionRates])

    if (!itemData) return <h1>Loading...</h1>

    const sizeSelectors = itemData.sizes.map(size => <SizeSelector key={size} size={size} activeSize={activeSize} changeSize={changeSize}/>)
    const variantSelectors = itemData.colors.map((color, i) => <VariantSelector key={i} variant={i}/>)

    const [show] = useState(window.visualViewport.width > 992)

    let price

    function getSizeFromParams() {
        return Number(searchParams.get("size")) || null
    }

    async function changeSize(size) {

        setActiveSize(size)

        setSearchParams(prev => {
            const params = new URLSearchParams(prev)
            if (size) {
                params.set("size", size)
            } else {
                params.delete("size")
            }
            return params
        })

        handlePrice()
    }

    async function handlePrice() {
        price = itemData.price

        if (notNil(conversionRates) && notNil(price)) {
            const usdPrice = price / conversionRates["EUR"]
            setConvertedPrice((conversionRates[currency] * usdPrice).toFixed(2))
            return
        }

        setConvertedPrice(null)
    }

    return(
        <div className={styles.itemInfo}>
            <div>
                <h1>{itemData.name}</h1>
                <p>{itemData.description}</p>  
                <div className={styles.colorways}>
                    {variantSelectors}
                </div>
                <p className={`${styles.sizeSelectLabel}`} id="sizeSelectLabel" type="button" data-bs-toggle="collapse" data-bs-target="#sizeSelectDropdown" aria-controls="sizeSelectDropdown" aria-expanded="false" aria-label="Toggle size selector">Select Size</p>
                <div className={`${styles.sizeSelect} ${show ? "show" : ""} row collapse justify-content-center`} id="sizeSelectDropdown">
                    {sizeSelectors}
                </div>
                <p className={styles.price}>{convertedPrice ? convertedPrice : "..."} {currency}</p>
                <div onMouseDown={() => addToCart(itemData.id, activeColor, activeSize)} className={styles.addCartButton}>
                    <p>Add to cart</p>
                    <img src={cart_icon}/>
                </div>
            </div>
        </div> 
    )
}

function SizeSelector({ size, activeSize, changeSize }) {
    const isActive = activeSize === size

    function handleClick() {
        changeSize(size)

        //reset red warning color back to black
        const sizeSelectLabel = document.getElementById("sizeSelectLabel")
        if (sizeSelectLabel) {
            sizeSelectLabel.style.color = "black"
        }
    }

    return <div className={`${styles.size} ${isActive ? styles.active : ""} col-5 col-lg-3 m-1 p-1`} onClick={handleClick}>EU {size}</div>
}

function VariantSelector({ variant }) {
    const [itemData] = useContext(ItemDataContext)
    const [activeColor, changeActiveColor] = useContext(ActiveColorContext)
    const isActive = activeColor === variant

    return(
        <div className={`${styles.colorway} ${isActive ? styles.active : ""}`} onClick={() => changeActiveColor(variant)}>
            <img src={`${shoeAssetsPath}/${itemData.id}/${itemData.id}_${variant+1}_1.png`}/>
        </div>
    )
}