import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useNavigate, useSearchParams } from "react-router-dom"
import styles from "../../styles/search.module.css"
import useTooltip from "../../customHooks/CustomTooltipsProvider"

export default function Color({ colors }) {

    const [activeColors, setActiveColors] = useState([])
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const colorSelectorsComponents = colors.map(color => {
        return <ColorSelector
            key={color}
            color={color}
            activeColors={activeColors}
            onChange={(e) => applyColors(color, e.target.checked)} />
    })

    useEffect(() => {
        reapplyColors()
    }, [searchParams])

    useEffect(() => {
        //forward searchParams
        searchParams.set("colors", activeColors.join("1"))
        navigate("/search?" + searchParams, { replace: true })
    }, [activeColors])

    function applyColors(color, checked) {
        setActiveColors(prev => {
            if (checked) return [...prev, color] //add color
            return prev.filter(id => id !== String(color)) //remove color
        })
    }

    function reapplyColors() {
        let colors = searchParams.get("colors")

        if (!colors) return

        colors = colors.split("1")

        setActiveColors(colors)
    }

    return (
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

function ColorSelector({ color, activeColors, onChange }) {
    const tooltipRef = useTooltip({
        title: color,
        placement: "top",
    })

    const isActive = activeColors.includes(color)

    return (
        <label htmlFor={color}>
            <input type="checkbox" id={color} checked={isActive} onChange={onChange} />
            <span ref={tooltipRef} style={{ backgroundColor: color }}>
            </span>
        </label>
    )
}
ColorSelector.PropTypes = {
    color: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}