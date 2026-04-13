import { useEffect, useState, useContext } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { format, notNil } from "../../modules/utils"
import { shoeAssetsPath } from "../../modules/utils"
import { string } from "../../modules/colors"
import styles from "../../styles/search.module.css"
import { useCurrency } from "../../customHooks/CurrencyProvider"
import { getConversionRates } from "../../api/currency"
import { getProductStock } from "../../api/productData"

export default function Item({ itemData }) {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [visible, setVisible] = useState(true)
    const {id, name, colors, brand, variants} = itemData
    const [itemStock, setItemStock] = useState()
    const [price, setPrice] = useState()
    const [isInStock, setIsInStock] = useState(false)
    const [colorway, setColorway] = useState({selectorIndex: 0, colorId: colors[0]})
    const colorways = colors.map((colorId, selectorIndex) => <ColorwaySelector
                                                key={selectorIndex}
                                                selectorIndex={selectorIndex}
                                                color={colorId}
                                                id={id}
                                                colorway={colorway}
                                                onClick={setColorway}/>)
    const {currency, conversionRates} = useCurrency()


    useEffect(() => {
        getStock()
    }, [])

    useEffect(() => {
        determineIfInStock()
        findLowestPrice()
    }, [itemStock])

    useEffect(() => {
        findLowestPrice()
    }, [currency, conversionRates])

    useEffect(() => {
        const params = getParams()
        
        const isVisible = matchParamsWithData(params)
        setVisible(isVisible)
        if (!isVisible) return

        selectSearchedColorway(params)
    }, [searchParams, price])

    async function getStock() {
        const itemStock = await getProductStock(itemData?.id)
        setItemStock(itemStock)
    }

    function determineIfInStock() {
        itemStock?.length > 0 ? setIsInStock(true) : setIsInStock(false)
    }

    async function findLowestPrice() {
        if (!itemStock || itemStock.length === 0) {
            setPrice(undefined)
            return
        }

        const stockSortedByPrice = [...itemStock].sort((a, b) => a.price - b.price)

        if(!notNil(stockSortedByPrice)) return

        const price = stockSortedByPrice[0]?.price

        let convertedPrice
        if (conversionRates) {
            const usdPrice = price / conversionRates["EUR"]
            convertedPrice = (conversionRates[currency] * usdPrice).toFixed(2)
        }
        setPrice(convertedPrice)
    }

    function matchParamsWithData(params) {
        const {searchText, min, max, activeColors, activeBrands} = params
        
        if (searchText && searchText.length != 0) {
            if(!format(name).includes(format(searchText))) return false
        }
        
        if (min && !(price >= parseFloat(min) && price <= parseFloat(max))) {
            console.log({message: "doesn't match price",price: price})
            return false
        }
        
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
        <div className={`${styles.item} ${!visible ? styles.hidden : ""} col-6 col-lg-3`} id={id}>
            <div className="href" onClick={redirect}>
                <div className={styles.imgContainer}>
                    <img  src={`${shoeAssetsPath}/${id}/${id}_${colorway.selectorIndex + 1}_1.png`} alt={name} />
                </div>
                <p className={styles.name}>{name}</p>
                <p className={styles.price}>{isInStock ? `${price ? price : "..."} ${currency}` : "Out of stock"}</p>
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