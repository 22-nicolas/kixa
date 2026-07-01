import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { notNil } from "../../modules/utils"
import { shoeAssetsPath } from "../../modules/utils"
import { string } from "../../modules/colors"
import styles from "../../styles/search.module.css"
import { useCurrency } from "../../customHooks/CurrencyProvider"
import { getProductStock } from "../../api/productData"
import { matchesSearchText } from "../../modules/searchMatcher"

export default function Item({ itemData, ignoreSearchText = false }) {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [visible, setVisible] = useState(true)
    const { id, name, colors, brand, variants } = itemData
    const [itemStock, setItemStock] = useState()
    const [price, setPrice] = useState()
    const [isInStock, setIsInStock] = useState(false)
    const [variant, setVariant] = useState(0)
    const variantSelectors = Array.from({ length: variants }, (_, i) => <VariantSelector
        key={i}
        variant={i}
        colors={colors[i]}
        id={id}
        variantState={variant}
        onClick={setVariant} />)
    const { currency, conversionRates } = useCurrency()

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

        selectSearchedColor(params)
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

        if (!notNil(stockSortedByPrice)) return

        const price = stockSortedByPrice[0]?.price

        let convertedPrice
        if (conversionRates) {
            const usdPrice = price / conversionRates["EUR"]
            convertedPrice = (conversionRates[currency] * usdPrice).toFixed(2)
        }
        setPrice(convertedPrice)
    }

    function matchParamsWithData(params) {
        const { searchText, min, max, activeColors, activeBrands } = params

        if (!ignoreSearchText && searchText && searchText.length != 0) {
            if (!matchesSearchText(name, searchText)) return false
        }

        if (min && !(price >= parseFloat(min) && price <= parseFloat(max))) {
            console.log({ message: "doesn't match price", price: price })
            return false
        }

        if (activeColors && !activeColors.some(activeColor => Object.values(colors).some(variant => variant.includes(activeColor)))) {
            return false
        }

        if (activeBrands && !activeBrands.includes(String(brand))) return false
        return true
    }

    function selectSearchedColor(params) {
        if (!params.activeColors) {
            setVariant(0);
        } else {
            const key = Number(Object.entries(colors).find(([_, variant]) =>
                params.activeColors.some(activeColor => variant.includes(activeColor))
            )?.[0])
            setVariant(key)
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
            colors = colors.split("1")
        }
        if (brands) {
            brands = brands.split("1")
        }

        return { searchText: searchText, min: min, max: max, activeColors: colors, activeBrands: brands }
    }

    function redirect() {
        const params = new URLSearchParams
        params.set("id", id)
        params.set("v", variant)
        navigate("/item?" + params)
    }

    return (
        <div className={`${styles.item} ${!visible ? styles.hidden : ""} col-6 col-lg-3`} id={id}>
            <div className="href" onClick={redirect}>
                <div className={styles.imgContainer}>
                    <img src={`${shoeAssetsPath}/${id}/${id}_${variant + 1}_1.png`} alt={name} />
                </div>
                <p className={styles.name}>{name}</p>
                <p className={styles.price}>{isInStock ? `${price ? price : "..."} ${currency}` : "Out of stock"}</p>
            </div>
            <div className={styles.colorways}>
                {variantSelectors}
            </div>
        </div>
    )
}

function VariantSelector({ variant, colors, onClick, id, variantState }) {
    return (
        <div className={`${styles.colorway} ${(variant == variantState) ? styles.active : ""}`} onClick={() => onClick(variant)}>
            <img src={`${shoeAssetsPath}/${id}/${id}_${variant + 1}_1.png`} alt={"variant " + variant} />
        </div>
    )
}
