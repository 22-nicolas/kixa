import { useContext, useEffect, useRef, useState } from "react";
import { useCart } from "../../customHooks/CartProvider";
import styles from "../../styles/cart.module.css"
import { useCurrency } from "../../customHooks/CurrencyProvider";
import { checkStockStatus, stockStates } from "../../modules/stockStatus";
import { checkoutTypes } from "../../../../packages/shared";
import PayPalBtn from "./PayPalBtn";

export default function Reciept() {
    const {cart, getQuantity, resolveCart, checkout} = useCart()
    const {currency, conversionRates} = useCurrency()
    const [quantity, setQuantity] = useState(0)
    const [itemsPrice, setItemsPrice] = useState(0)
    const shipping = 0
    
    useEffect(() => {
        setQuantity(getQuantity())
        loadPrices()
    }, [cart, currency, conversionRates])

    async function loadPrices() {
        const resolvedCart = await resolveCart()
        
        const results = await Promise.all(
            resolvedCart.map(async (item) => {
                const { id, color, size, quantity } = item
                const status = await checkStockStatus(id, color, size, quantity)

                if (status.stockState !== stockStates.outOfStock) {
                    return item.price * quantity
                }

                return 0
            })
        )

        let price = results.reduce((sum, value) => sum + conertPrice(value), 0)
        price = Number(price.toFixed(2))

        setItemsPrice(price)
    }
    
    function conertPrice(price) {
        if (price && conversionRates && currency) {
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
                <div className="btn btn-dark text-center w-75" onClick={() => checkout(checkoutTypes.STRIPE)}><p className="text-white m-auto">Go to Checkout</p></div>
                <div className="separator">
                    <div className="line"></div>
                    <span>or continue with</span>
                    <div className="line"></div>
                </div>
                <PayPalBtn className="w-75" onClick={() => checkout(checkoutTypes.PAYPAL)} />
            </div>
        </div>
    )
}