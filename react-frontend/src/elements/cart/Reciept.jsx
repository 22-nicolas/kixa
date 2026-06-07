import { useContext, useEffect, useRef, useState } from "react";
import { useCart } from "../../customHooks/CartProvider";
import styles from "../../styles/cart.module.css"
import { useCurrency } from "../../customHooks/CurrencyProvider";
import PayPalBtn from "./PayPalBtn";
import { useToasts } from "../../customHooks/CustomToastsProvider";
import { useNavigate } from "react-router-dom";

export default function Reciept() {
    const {cart, getQuantity, resolveCart, checkout} = useCart()
    const {currency, conversionRates} = useCurrency()
    const [quantity, setQuantity] = useState(0)
    const [itemsPrice, setItemsPrice] = useState(0)
    const {addToast} = useToasts()
    const navigate = useNavigate()
    const shipping = 0
    
    useEffect(() => {
        setQuantity(getQuantity())
        loadPrices()
    }, [cart, currency, conversionRates])

    async function loadPrices() {
        const resolvedCart = await resolveCart()
        
        const totalPrice = resolvedCart.reduce((sum, item) => {
            if (item.price && item.quantity) {
                return sum + convertPrice(item.price * item.quantity)
            }
            return sum
        }, 0)

        setItemsPrice(Number(totalPrice.toFixed(2)))
    }
    
    function convertPrice(price) {
        if (price && conversionRates && conversionRates["EUR"] && currency) {
            const usdPrice = price / conversionRates["EUR"]
            const convertedPrice = conversionRates[currency] * usdPrice
            return convertedPrice
        }

        return 0
    }

    return (
        <div className={styles.reciept}>
            <div>
                <p>Items ({quantity})</p>
                <p>{itemsPrice} {currency}</p>
            </div>
            <div>
                <p>Shipping</p>
                <p>{shipping} {currency}</p>
            </div>
            <div>
                <p>Discounts</p>
                <p>0 {currency}</p>
            </div>
            <div className={styles.subtotal}>
                <p>Subtotal</p>
                <p>{itemsPrice+shipping} {currency}</p>
            </div>
            <div className="d-flex flex-column">
                <div className="btn btn-dark text-center w-75" onClick={() => checkout()}><p className="text-white m-auto">Go to Checkout</p></div>
            </div>
        </div>
    )
}