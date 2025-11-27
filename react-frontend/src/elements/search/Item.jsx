import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { format } from "../../../../old-frontend/scripts/utils/utils"
import { shoeAssetsPath } from "../../modules/utils"
import { string } from "../../modules/colors"

export default function Item({ itemData }) {

    const [searchParams] = useSearchParams()
    const [visible, setVisible] = useState(true)
    const {id, name, price, colors, brand, variants} = itemData
    const colorwaySelectors = useRef([])
    const [colorway, setColorway] = useState({selectorIndex: 0, colorId: colors[0]})
    //const colorIndex = colors.findIndex(color => color == colorway) + 1

    const colorways = Array.from({ length: variants }).map((_, i) => <ColorwaySelector
                                                                        key={i}
                                                                        i={i}
                                                                        color={colors[i]}
                                                                        id={id}
                                                                        colorway={colorway}
                                                                        onClick={setColorway}/>)
    
    useEffect(() => {
        const params = getParams()
        
        const isVisible = matchParamsWithData(params)
        setVisible(isVisible)
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

    return(
        <div className={visible ? "item" : "item hidden"} id={id}>
            <div className="href">
                <div className="img-container">
                    <img className="item-img" src={`${shoeAssetsPath}/${id}/${id}_${colorway.selectorIndex + 1}_1.png`} alt={name} />
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

function ColorwaySelector({ i, color, onClick, id, colorway }) {
    return(
        <div className={(i == colorway.selectorIndex) ? "color-way active" : "color-way"} data-color={color} onClick={() => onClick({selectorIndex: i, colorId: colorway})}>
            <img src={`${shoeAssetsPath}/${id}/${id}_${i+1}_1.png`} alt={"colorway " + string(color)}/>
        </div>
    )
}