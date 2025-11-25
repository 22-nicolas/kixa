import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function Color({ colors }) {

    const [activeColors, setActiveColors] = useState([])
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    
    colors = Object.entries(colors)
    const colorSelectorsComponents = colors.map(color => {
        const colorId = color[1]
        const colorName = color[0]
        return <ColorSelector 
                    key={colorId} 
                    colorName={colorName} 
                    activeColors={activeColors} 
                    colorId={colorId} 
                    onChange={(e) => applyColors(colorId, e.target.checked)}/>
    })

    useEffect(() => {
        reapplyColors()
    }, [searchParams])

    useEffect(() => {
        //forward searchParams
        searchParams.set("colors", activeColors.join("a")) 
        navigate("/search?" + searchParams)
    }, [activeColors])

    function applyColors(colorId, checked) {
        console.log(checked)
        setActiveColors(prev =>{
            if (checked) return [...prev, colorId] //add colorId
            console.log({prev: prev, colorId: colorId})
            return prev.filter(id => id !== String(colorId)) //remove colorId
        })
    }

    function reapplyColors() {
        let colors = searchParams.get("colors")
        
        if (!colors) return

        colors = colors.split("a")

        setActiveColors(colors)
    }

    return(
        <div className="color">
            <h1>Color</h1>
            <div className="color-selectors">
                {colorSelectorsComponents}
            </div>
        </div>
    )
}
Color.PropTypes = {
    colors: PropTypes.object.isRequired
}

function ColorSelector({ colorId, colorName, activeColors, onChange }) {
    const span = useRef()
    useEffect(() => {
        //color in span
        span.current.style.backgroundColor = span.current.parentElement.htmlFor;
    }, [])

    const isActive = activeColors.includes(String(colorId))

    return(
        <label htmlFor={colorName}>
            <input type="checkbox" id={colorName} checked={isActive} onChange={onChange}/>
            <span ref={span}></span>
        </label>
    )
}
ColorSelector.PropTypes = {
    color: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}