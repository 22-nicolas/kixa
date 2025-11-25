import { useEffect, useRef, forwardRef } from "react"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import { Colors, string } from "../../modules/colors"

export default function Color({ colors }) {

    colors = Object.entries(colors)
    const colorSelectors = useRef([])
    const colorSelectorsComponents = colors.map(color => <ColorSelector key={color[1]} ref={el => colorSelectors.current[color[1]] = el} color={color[1]} onChange={applyColors}/>)
    const navigate = useNavigate()

    function applyColors() {
        let activeColors = ""
        colorSelectors.current.forEach((selector) => {
            if (selector.querySelector("input").checked) {
                activeColors += selector.dataset.color + "a"
            }
        })

        const params = new URLSearchParams(window.location.search)
        params.set("colors", activeColors) 

        navigate("/search?" + params)
    }

    function reapplyColors() {
        
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

const ColorSelector = forwardRef(function ColorSelector({ color, onChange }, ref) {
    const span = useRef()
    useEffect(() => {
        //color in span
        span.current.style.backgroundColor = span.current.parentElement.htmlFor;
    }, [])

    return(
        <label ref={ref} data-color={color} htmlFor={string(color)} onChange={onChange}>
            <input type="checkbox" id={string(color)}/>
            <span ref={span}></span>
        </label>
    )
})
ColorSelector.PropTypes = {
    color: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}