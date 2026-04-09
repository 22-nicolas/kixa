import { use, useContext, useEffect, useState } from "react"
import { useCart } from "../../customHooks/CartProvider"
import { CurrencyContext } from "../../customHooks/CurrencyProvider"
import styles from "../../styles/cart.module.css"
import { Link } from "react-router-dom"
import { shoeAssetsPath } from "../../modules/utils"
import { checkStockStatus, stockStates } from "../../modules/stockStatus"


export default function CartItem({ itemData }) {
    const {cart, removeFromCart, updateCart} = useCart()
    const {id, name, color, size, quantity} = itemData
    const [price, setPrice] = useState(itemData.price)
    const {currency, conversionRates} = useContext(CurrencyContext)
    const [stockStatus, setStockStatus] = useState({stockState: stockStates.inStock, productStock: null})

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
            setPrice(convertedPrice)
        }
    }

    async function checkStock() {
        const status = await checkStockStatus(id, color, size, quantity)
        setStockStatus(status)

        if (status.stockState === stockStates.notEnoughStock) {
            updateCart(prevCart => {
                const itemIndex = prevCart.findIndex(i => i.id === id && i.color === color && i.size === size);
                if (itemIndex !== -1 && prevCart[itemIndex].quantity !== status.productStock) {
                    const toastEl = document.getElementById('stockToast');
                    if (toastEl && window.bootstrap) {
                        toastEl.querySelector('.toast-body').textContent = `Only ${status.productStock} units of ${name} are available. Your cart has been updated.`;
                        window.bootstrap.Toast.getOrCreateInstance(toastEl).show();
                    }
                    return prevCart.map((item, idx) => idx === itemIndex ? { ...item, quantity: status.productStock } : item);
                }
                return prevCart;
            });
        }
    }

    return(
        <div key={`${id}${color}${size}`} className={`${styles.item} ${stockStatus.stockState === stockStates.outOfStock ? "outOfStock" : ""}`}>
            <div className={"d-flex align-items-top justify-content-start"}>
                <div className={`${styles.imgContainer}`}><img src={`${shoeAssetsPath}/${id}/${id}_${color + 1}_1.png`}/></div>
                <div className="row justify-content-start ms-3 w-100">
                    <div className="item-info col-12 col-lg-6">
                        <Link to={`/item?id=${id}&c=${color}&size=${size}`}>{name}</Link>
                        <p className="color-size">{color}, EU {size}</p>
                    </div>
                    <p className="item-qty col-4 col-lg-3">Qty {quantity}</p>
                    <p className="price col-4 col-lg-3">{stockStatus.stockState === stockStates.outOfStock ? "out of stock" : `${(price*quantity).toFixed(2)} ${currency}`}</p>
                </div>
            </div>
            <p className={styles.removeBtn} onMouseDown={() => removeFromCart(id, color, size)}>Remove</p>
        </div>
    )
}