import { useEffect, useRef, useState, forwardRef } from "react"
import { useSearchParams } from "react-router-dom"
import { format } from "../../../../old-frontend/scripts/utils/utils"
import { shoeAssetsPath } from "../../modules/utils"

export default function Item({ itemData }) {

    const [searchParams] = useSearchParams()
    const [visible, setVisible] = useState(true)
    const {id, name, price, colors, brand, sizes, description, variants} = itemData
    const colorwaySelectors = useRef([])
    const [activeColorway, setActiveColorway] = useState()

    const colorways = Array.from({ length: variants }).map((_, i) => <ColorwaySelector key={i} i={i} ref={el => colorwaySelectors.current[i] = el} id={id} onClick={setColorway}/>)
    
    useEffect(() => {
        const params = getParams()
        
        const isVisible = matchParamsWithData(params)
        setVisible(isVisible)

        setColorway(0) //set first colorway as default
    }, [searchParams])

    function matchParamsWithData(params) {
        const {searchText, min, max, activeColors, activeBrands} = params
        
        if (searchText && searchText.length != 0) {
            if(!format(name).includes(format(searchText))) return false
        }
        
        if (min && !(price >= parseFloat(min) && price <= parseFloat(max))) return false
        
        if (activeColors && !activeColors.some(activeColor => colors.includes(Number(activeColor)))) {
            return false
        }
        
        if (activeBrands && !activeBrands.includes(String(brand))) return false
        return true
    }

    function getParams() {
        //get params
        const searchText = searchParams.get("searchText")
        const min = searchParams.get("min")
        const max = searchParams.get("max")
        let colors = searchParams.get("colors")
        let brands = searchParams.get("brands")
        
        //format
        if (colors) {
            colors = colors.split("a")
        }
        if (brands) {
            brands = brands.split("a")
        }
        
        return {searchText: searchText, min: min, max: max, activeColors: colors, activeBrands: brands}
    }

    function setColorway(color) {
        //deselect all other selectors
        colorwaySelectors.current.forEach(selector => {
            selector.classList.remove('active')
        });

        colorwaySelectors.current[color].classList.add('active')
        setActiveColorway(color + 1) //file colorway denumeration starts at 1 => +1
    }

    return(
        <div className={visible ? "item" : "item hidden"} id={id}>
            <div className="href">
                <div className="img-container">
                    <img className="item-img" src={`${shoeAssetsPath}/${id}/${id}_${activeColorway}_1.png`}/>
                </div>
                <p className="name">{name}</p>
                <p className="price">{price}$</p>
            </div>
            <div className="color-ways">
                {colorways}
            </div>
        </div>
    )
}

const ColorwaySelector = forwardRef(function ColorwaySelector({ i, onClick, id }, ref) {
    return(
        <div ref={ref} className="color-way" data-color={i} onClick={() => onClick(i)}>
            <img src={`${shoeAssetsPath}/${id}/${id}_${i+1}_1.png`}/>
        </div>
    )
})