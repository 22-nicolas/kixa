import { useEffect, useRef, forwardRef } from "react"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import { Brands, string } from "../../modules/brands.js"
import check from "../../assets/check.png"

export default function Brand({ brands }) {

    brands = Object.entries(brands)
    const brandSelectors = useRef([])
    const brandSelectorsComponents = brands.map(brand => <BrandSelector key={brand[1]} ref={el => brandSelectors.current[brand[1]] = el} brand={brand[1]} onChange={applyBrands}/>)
    const navigate = useNavigate()

    function applyBrands() {
        let activeBrands = ""
        brandSelectors.current.forEach((selector) => {
            if (selector.querySelector("input").checked) {
                activeBrands += selector.dataset.brand + "a"
            }
        })


        const params = new URLSearchParams(window.location.search)
        params.set("brands", activeBrands) 

        navigate("/search?" + params)
    }

    return(
        <div className="brand">
            {brandSelectorsComponents}
        </div>
    )
}
Brand.PropTypes = {
    brands: PropTypes.object.isRequired
}

const BrandSelector = forwardRef(function brandSelector({ brand, onChange }, ref) {
    const stringBrand = string(brand)
    console.log(stringBrand)
    return(
        <label ref={ref} data-brand={brand} htmlFor={stringBrand} onChange={onChange}>
            <span className="custom-checkbox"><input type="checkbox" id={stringBrand}/><img src={check}/></span>
            <p>{stringBrand}</p>
        </label>
    )
})
BrandSelector.PropTypes = {
    brand: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
}