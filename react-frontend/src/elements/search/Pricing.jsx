import { useEffect, useRef, useContext, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useCurrency } from "../../customHooks/CurrencyProvider"
import styles from "../../styles/search.module.css"
import { notNil } from "../../modules/utils"

export default function Pricing() {
    const maxPriceInEuro = 500

    const minSlider = useRef()
    const maxSlider = useRef()
    const minNum = useRef()
    const maxNum = useRef()
    const [maxPrice, setMaxPrice] = useState(maxPriceInEuro)
    const [minValue, setMinValue] = useState(0)
    const [maxValue, setMaxValue] = useState(maxPriceInEuro)
    const range = useRef()
    const navigate = useNavigate()
    const {currency, conversionRates} = useCurrency()
    const [searchParams] = useSearchParams()

    useEffect(reapplyPricing, [maxPrice, searchParams])

    useEffect(() => {
        if (!conversionRates || !currency) return

        const maxPriceInUSD = maxPriceInEuro / conversionRates["EUR"]
        const maxConvertedPrice = Number((conversionRates[currency] * maxPriceInUSD).toFixed(2))
        setMaxPrice(maxConvertedPrice)
        //setMaxValue(maxConvertedPrice)

    }, [currency, conversionRates])

    useEffect(updateUI, [minValue, maxValue])

    function updateUI() {
        updateNumInputs()
        updateSliders()
        updateRange()
    }

    function handleMinValue(newValue) {
        newValue = parseFloat(newValue)
        if (isNaN(newValue)) {
            setMinValue(0)
            return
        }
        newValue = Math.max(0, Math.min(newValue, maxValue))
        setMinValue(newValue)

        if (newValue === minValue) updateUI()
    }

    function handleMaxValue(newValue) {
        newValue = parseFloat(newValue)
        if (isNaN(newValue)) {
            setMaxValue(maxPrice)
            return
        }
        newValue = Math.min(Math.max(newValue, minValue), maxPrice)
        setMaxValue(newValue)

        if (newValue === maxValue) updateUI()
    }

    function updateSliders() {
        minSlider.current.value = minValue
        maxSlider.current.value = maxValue

        updateRange()
    }

    function updateNumInputs() {
        minNum.current.value = minValue;
        maxNum.current.value = maxValue;
    }

    function updateRange() {
        const minInPixels = (minValue - minSlider.current.min) / (minSlider.current.max - minSlider.current.min) * minSlider.current.offsetWidth
        const maxInPixels = (maxValue - maxSlider.current.min) / (maxSlider.current.max - maxSlider.current.min) * maxSlider.current.offsetWidth
    
        const rangeInPixels = maxInPixels-minInPixels;
    
        range.current.style.transform = `translateX(${minInPixels}px) scaleX(${(rangeInPixels) / (minSlider.current.offsetWidth)})`;
    }

    function applyPricing() {
        searchParams.set("min", minSlider.current.value) 
        searchParams.set("max", maxSlider.current.value)

        navigate("/search?" + searchParams)
    }

    function reapplyPricing() {
        const min = searchParams.get("min")
        const max = searchParams.get("max")

        handleMinValue(min)
        handleMaxValue(max)
    }

    return(
        <div className={styles.pricing}>
            <div className={styles.text}>
                <h1>Price</h1>
                <div className={styles.numInputs}>
                    <div className={styles.priceInput}>
                        <p>{currency}</p>
                        <input ref={minNum} type="number" id="minNum" min="0" max={maxPrice} defaultValue="0" onChange={() => handleMinValue(minNum.current.value)} className={styles.minNum}/>
                    </div>
                    <p className={styles.separator}>-</p>
                    <div className={styles.priceInput}>
                        <p>{currency}</p>
                        <input ref={maxNum} type="number" id="maxNum" min="0" max={maxPrice} defaultValue={maxPrice} onChange={() => handleMaxValue(maxNum.current.value)} className={styles.maxNum}/>
                    </div>
                </div>
            </div>
            <div className={styles.rangeSlider}>
                <input ref={minSlider} type="range" id="min" min="0" max={maxPrice} defaultValue="0" onChange={() => handleMinValue(minSlider.current.value)} className={styles.min}/>
                <input ref={maxSlider} type="range" id="max" min="0" max={maxPrice} defaultValue={maxPrice} onChange={() => handleMaxValue(maxSlider.current.value)} className={styles.max}/>
                <input type="range" min="0" max={maxPrice} defaultValue={maxPrice} className={styles.backslider}/>
                <div ref={range} className={styles.range} id="range"></div>
            </div>
            <button className={styles.applyButton} onClick={applyPricing}>Apply</button>
        </div>
    )
}