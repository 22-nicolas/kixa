import { ActiveColorContext, ItemDataContext, ItemStockContext } from "../../pages/Item"
import { useContext, useState, useEffect, useRef } from "react"
import styles from "../../styles/item.module.css"
import cart_icon from "../../assets/cart_icon.png"
import { notNil, shoeAssetsPath } from "../../modules/utils"
import { useCart } from "../../customHooks/CartProvider"
import { useSearchParams } from "react-router-dom"
import { CurrencyContext } from "../../customHooks/CurrencyProvider"

export default function ItemInfo() {
    const [itemData, setItemData] = useContext(ItemDataContext)
    const [itemStock] = useContext(ItemStockContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const [activeSize, setActiveSize] = useState(getSizeFromParams())
    const [activeColor] = useContext(ActiveColorContext)
    const {addToCart} = useCart()
    const {currency, conversionRates} = useContext(CurrencyContext)
    const [convertedPrice, setConvertedPrice] = useState(null)
    const [isInStock, setIsInStock] = useState(false)

    useEffect(() => {
        determineIfInStock()
    }, [itemStock])

    useEffect(() => { 
        changeSize(getSizeFromParams())
    }, [searchParams, itemStock, activeColor])

    useEffect(() => { 
        handlePrice()
    }, [currency, conversionRates])

    if (!itemData) return <h1>Loading...</h1>

    const sizeSelectors = itemData.sizes.map(size => <SizeSelector key={size} size={size} activeSize={activeSize} changeSize={changeSize}/>)
    const variantSelectors = itemData.colors.map((color, i) => <VariantSelector key={i} variant={i}/>)

    const [show] = useState(window.visualViewport.width > 992)

    let price

    function determineIfInStock() {
        itemStock?.length > 0 ? setIsInStock(true) : setIsInStock(false)
    }

    function getSizeFromParams() {
        return Number(searchParams.get("size")) || null
    }

    async function changeSize(size) {
        //check if active size is in stock, if not set active size to null
        const isInStock = itemStock?.find(stockItem => stockItem.size == size && stockItem.variant == activeColor)?.stock > 0
        if (!isInStock && notNil(itemStock) && notNil(size)) {
            changeSize(null)
            return
        }

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
        price = itemStock?.find(stockItem => stockItem.size == activeSize && stockItem.variant == activeColor)?.price || null

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
                <p className={styles.price}>{convertedPrice ? convertedPrice + " " + currency : "Please select a size to see the respective price."}</p>
                <div onMouseDown={() => isInStock ?  addToCart(itemData.id, activeColor, activeSize) : null} className={`${styles.addCartButton} ${isInStock ? "" : styles.outOfStock}`}>
                    <p>{isInStock ? "Add to cart" : "Out of stock"}</p>
                    <img src={cart_icon}/>
                </div>
            </div>
        </div> 
    )
}

function SizeSelector({ size, activeSize, changeSize }) {
    const [itemStock] = useContext(ItemStockContext)
    const [activeColor] = useContext(ActiveColorContext)
    const [isInStock, setIsInStock] = useState(false)
    const tooltipRef = useRef()

    const isActive = activeSize === size

    useEffect(() => {
        checkStock()
    }, [itemStock, activeColor])


    useEffect(() => {
        if(!isInStock) {
            const tooltip = initTooltip()
            return () => tooltip?.dispose()
        }
    }, [isInStock])

    function initTooltip() {
        return tooltipRef.current ? new bootstrap.Tooltip(tooltipRef.current) : null
    }

    async function checkStock() {
        setIsInStock(itemStock?.find(stockItem => stockItem.size == size && stockItem.variant == activeColor)?.stock > 0)
    }

    function handleClick() {
        changeSize(size)

        //reset red warning color back to black
        const sizeSelectLabel = document.getElementById("sizeSelectLabel")
        if (sizeSelectLabel) {
            sizeSelectLabel.style.color = "black"
        }
    }

    return <div ref={tooltipRef}
                className={`${styles.size} ${isActive ? styles.active : ""} ${isInStock ? "" : styles.outOfStock} col-5 col-lg-3 m-1 p-1`} 
                onClick={isInStock ? handleClick : undefined}
                data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="out-of-stock-tooltip"
                data-bs-title="out of stock">
                EU {size}
            </div>
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