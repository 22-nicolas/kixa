import { use, useContext, useEffect, useState } from "react"
import { useCart } from "../../customHooks/CartProvider"
import { CurrencyContext } from "../../customHooks/CurrencyProvider"
import styles from "../../styles/cart.module.css"
import { Link } from "react-router-dom"
import { shoeAssetsPath } from "../../modules/utils"
import { checkStockStatus, stockStates } from "../../modules/stockStatus"


export default function CartItem({ itemData }) {
    const {cart, removeFromCart} = useCart()
    const {id, name, color, size, quantity} = itemData
    const [price, setPrice] = useState(itemData.price)
    const {currency, conversionRates} = useContext(CurrencyContext)
    const [stockStatus, setStockStatus] = useState("inStock")

    useEffect(() => {
        convertPrice()
    }, [currency, conversionRates, itemData.price])

    useEffect(() => {
        checkStock()
    }, [cart])

    async function convertPrice() {
        if (itemData.price && conversionRates && currency) {
            const usdPrice = itemData.price / conversionRates["EUR"]
            const convertedPrice = Number((conversionRates[currency] * usdPrice).toFixed(2))
            console.log(convertedPrice * 5)
            setPrice(convertedPrice)
        }
    }

    async function checkStock() {
        const stockStatus = await checkStockStatus(id, color, size, quantity)
        setStockStatus(stockStatus)
    }

    return(
        <div key={`${id}${color}${size}`} className={`${styles.item} ${stockStatus === stockStates.outOfStock ? "outOfStock" : ""}`}>
            <div className={"d-flex align-items-top justify-content-start"}>
                <div className={`${styles.imgContainer}`}><img src={`${shoeAssetsPath}/${id}/${id}_${color + 1}_1.png`}/></div>
                <div className="row justify-content-start ms-3 w-100">
                    <div className="item-info col-12 col-lg-6">
                        <Link to={`/item?id=${id}&c=${color}&size=${size}`}>{name}</Link>
                        <p className="color-size">{color}, EU {size}</p>
                    </div>
                    <p className="item-qty col-4 col-lg-3">Qty {quantity}</p>
                    <p className="price col-4 col-lg-3">{stockStatus === stockStates.outOfStock ? "out of stock" : `${(price*quantity).toFixed(2)} ${currency}`}</p>
                </div>
            </div>
            <p className={styles.removeBtn} onMouseDown={() => removeFromCart(id, color, size)}>Remove</p>
        </div>
    )
}