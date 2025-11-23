import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { format } from "../../../../old-frontend/scripts/utils/utils"


export default function Item({ itemData }) {

    const [searchParams] = useSearchParams()
    const [visible, setVisible] = useState(true)
    const {id, name, price, colors, brand, sizes, description, variants} = itemData

    const shoeAssetsPath = "public/shoes"

    const colorways = Array.from({ length: variants }).map((_, i) => 
    <div key={i} className="color-way" data-color={i}>
        <img src={`${shoeAssetsPath}/${id}/${id}_${i+1}_1.png`}/>
    </div>)
    
    
    
    useEffect(() => {
        const params = getParams()
        
        //console.log({searchText: searchText, min: min, max: max, colors: activeColors, brands: activeBrands})
        setVisible(matchParamsWithData(params))

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
        const searchText = searchParams.get("searchText")
        const min = searchParams.get("min")
        const max = searchParams.get("max")
        let colors = searchParams.get("colors")
        let brands = searchParams.get("brands")
        
        if (colors) {
            colors = colors.split("a")
            colors.pop() //due to the separator being after every color the last entry of the array will be: "" => remove that
        }
        if (brands) {
            brands = brands.split("a")
            brands.pop() //due to the separator being after every color the last entry of the array will be: "" => remove that
        }
        
        return {searchText: searchText, min: min, max: max, activeColors: colors, activeBrands: brands}
    }

    return(
        <div className={visible ? "item" : "item hidden"} id={id}>
            <div className="href">
                <div className="img-container">
                    <img className="item-img" src={`${shoeAssetsPath}/${id}/${id}_1_1.png`}/>
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