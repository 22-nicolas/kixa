import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import check from "../../assets/check.png"

export default function Brand({ brands }) {

    const [activeBrands, setActiveBrands] = useState([])
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    brands = Object.entries(brands)
    const brandSelectorsComponents = brands.map(brand => {
        const brandId = brand[1]
        const brandName = brand[0]
        return <BrandSelector
                    key={brandId}
                    brandName={brandName}
                    brandId={brandId}
                    activeBrands={activeBrands}
                    onChange={(e) => applyBrands(brandId, e.target.checked)}
                />
    })

    useEffect(() => {
        reapplyBrands()
    }, [searchParams])

    useEffect(() => {
        //forward searchParams
        searchParams.set("brands", activeBrands.join("a")) 
        navigate("/search?" + searchParams)
    }, [activeBrands])

    function applyBrands(brandId, checked) {
        setActiveBrands(prev =>{
            if (checked) return [...prev, brandId] //add brandId
            return prev.filter(id => id !== String(brandId)) //remove brandId
        })
    }

    function reapplyBrands() {
        let brands = searchParams.get("brands")
        
        if (!brands) return

        brands = brands.split("a")

        setActiveBrands(brands)
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

function BrandSelector({ brandId, brandName, onChange, activeBrands }) {
    const isActive = activeBrands.includes(String(brandId))
    return(
        <label htmlFor={brandName}>
            <span className="custom-checkbox"><input type="checkbox" id={brandName} checked={isActive} onChange={onChange}/><img src={check}/></span>
            <p>{brandName}</p>
        </label>
    )
}
BrandSelector.PropTypes = {
    brand: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
}