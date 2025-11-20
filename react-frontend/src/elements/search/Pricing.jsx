import { useRef } from "react"

export default function Pricing() {
    const minSlider = useRef()
    const maxSlider = useRef()
    const minNum = useRef()
    const maxNum = useRef()
    const range = useRef()
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
            <button className="apply-button">Apply</button>
        </div>
    )
}