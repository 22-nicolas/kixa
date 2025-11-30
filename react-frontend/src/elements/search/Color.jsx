import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useNavigate, useSearchParams } from "react-router-dom"
import styles from "../../styles/search.module.css"

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
        setActiveColors(prev =>{
            if (checked) return [...prev, colorId] //add colorId
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
        <div className={styles.color}>
            <h1>Color</h1>
            <div className={styles.colorSelectors}>
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