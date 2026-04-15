import { useContext, useEffect, useState } from "react";
import { useCart } from "../../customHooks/CartProvider";
import styles from "../../styles/cart.module.css"
import { useCurrency } from "../../customHooks/CurrencyProvider";
import { checkStockStatus, stockStates } from "../../modules/stockStatus";

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
                    return Number(item.price) * Number(quantity)
                }

                return 0
            })
        )

        const prices = results.reduce((sum, value) => sum + conertPrice(value), 0)

        setItemsPrice(prices)
    }
    
    function conertPrice(price) {
        if (price && conversionRates && currency) {
            const usdPrice = price / conversionRates["EUR"]
            const convertedPrice = Number((conversionRates[currency] * usdPrice).toFixed(2))
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
            <div className={styles.checkoutBtn} onClick={checkout}><p>Go to checkout</p></div>
        </div>
    )
}