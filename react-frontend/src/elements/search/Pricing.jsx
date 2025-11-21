import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

export default function Pricing() {
    const minSlider = useRef()
    const maxSlider = useRef()
    const minNum = useRef()
    const maxNum = useRef()
    const range = useRef()
    const navigate = useNavigate()

    useEffect(reapplyPricing, [])

    //TODO: fix wierd behaviour when inputing number values
    function updateRange() {
        
        let values = [parseInt(minSlider.current.value), parseInt(maxSlider.current.value)]
        let minValue = Math.min(...values);
        let maxValue = Math.max(...values);
        
        //also update num inputs
        minNum.current.value = minValue;
        maxNum.current.value = maxValue;
    
        const minInPixels = (minValue - minSlider.current.min) / (minSlider.current.max - minSlider.current.min) * minSlider.current.offsetWidth
        const maxInPixels = (maxValue - maxSlider.current.min) / (maxSlider.current.max - maxSlider.current.min) * maxSlider.current.offsetWidth
    
        const rangeInPixels = maxInPixels-minInPixels;
    
        range.current.style.transform = `translateX(${minInPixels}px) scaleX(${(rangeInPixels) / (minSlider.current.offsetWidth)})`;
    
    }

    function updatSliders() {
        let values = [parseInt(minNum.current.value), parseInt(maxNum.current.value)]
        let minValue = Math.min(...values);
        let maxValue = Math.max(...values);

        minSlider.current.value = minValue
        maxSlider.current.value = maxValue

        updateRange()
    }

    function applyPricing() {
        const params = new URLSearchParams(window.location.search)
        params.set("max", minSlider.current.value) 
        params.set("min", maxSlider.current.value)

        navigate("/search?" + params)
    }

    function reapplyPricing() {
        const params = new URLSearchParams(window.location.search)
        const min = params.get("min")
        const max = params.get("max")
        
        minNum.current.value = min
        maxNum.current.value = max

        updatSliders()
    }

    return(
        <div className="pricing">
            <div className="text">
                <h1>Price</h1>
                <div className="num-inputs">
                    <div className="price-input">
                        <p>€</p>
                        <input ref={minNum} type="number" id="minNum" min="0" max="170" defaultValue="0" onChange={updatSliders} className="minNum"/>
                    </div>
                    <p className="separator">-</p>
                    <div className="price-input">
                        <p>€</p>
                        <input ref={maxNum} type="number" id="maxNum" min="0" max="170" defaultValue="500" onChange={updatSliders} className="maxNum"/>
                    </div>
                </div>
            </div>
            <div className="range-slider">
                <input ref={minSlider} type="range" id="min" min="0" max="500" defaultValue="0" onChange={updateRange} className="min"/>
                <input ref={maxSlider} type="range" id="max" min="0" max="500" defaultValue="500" onChange={updateRange} className="max"/>
                <input type="range" min="0" max="500" defaultValue="500" className="backslider"/>
                <div ref={range} className="range" id="range"></div>
            </div>
            <button className="apply-button" onClick={applyPricing}>Apply</button>
        </div>
    )
}