import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { format } from "../../../../old-frontend/scripts/utils/utils"
import { shoeAssetsPath } from "../../modules/utils"
import { string } from "../../modules/colors"
import styles from "../../styles/search.module.css"

export default function Item({ itemData }) {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [visible, setVisible] = useState(true)
    const {id, name, price, colors, brand, variants} = itemData
    const [colorway, setColorway] = useState({selectorIndex: 0, colorId: colors[0]})
    const colorways = colors.map((colorId, selectorIndex) => <ColorwaySelector
                                                key={selectorIndex}
                                                selectorIndex={selectorIndex}
                                                color={colorId}
                                                id={id}
                                                colorway={colorway}
                                                onClick={setColorway}/>)
    
    useEffect(() => {
        const params = getParams()
        
        const isVisible = matchParamsWithData(params)
        setVisible(isVisible)
        if (!isVisible) return

        selectSearchedColorway(params)
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

    function selectSearchedColorway(params) {
        if (!params.activeColors) {
            setColorway({selectorIndex: 0, colorId: colors[0]});
        } else {
            for (let i = 0; i < variants; i++) {
                if (params.activeColors.includes(String(colors[i]))) { 
                    setColorway({selectorIndex: i, colorId: colors[i]});
                    return
                }
            }
        }
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

    function redirect() {
        const params = new URLSearchParams
        params.set("id", id)
        params.set("c", colorway.selectorIndex)
        navigate("/item?" + params)
    }

    return(
        <div className={`${styles.item} ${!visible ? styles.hidden : ""}`} id={id}>
            <div className="href" onClick={redirect}>
                <div className={styles.imgContainer}>
                    <img  src={`${shoeAssetsPath}/${id}/${id}_${colorway.selectorIndex + 1}_1.png`} alt={name} />
                </div>
                <p className={styles.name}>{name}</p>
                <p className={styles.price}>{price}$</p>
            </div>
            <div className={styles.colorways}>
                {colorways}
            </div>
        </div>
    )
}

function ColorwaySelector({ selectorIndex, colorId, onClick, id, colorway }) {
    return(
        <div className={`${styles.colorway} ${(selectorIndex == colorway.selectorIndex) ? styles.active : ""}`} onClick={() => onClick({selectorIndex: selectorIndex, colorId: colorId})}>
            <img src={`${shoeAssetsPath}/${id}/${id}_${selectorIndex+1}_1.png`} alt={"colorway " + string(colorId)}/>
        </div>
    )
}