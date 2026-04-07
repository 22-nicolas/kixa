import { createContext, useEffect, useState } from "react"
import { getProductById, getProductStock } from "../api/productData"
import { useNavigate, useSearchParams } from "react-router-dom"

import Container from "../elements/general/Container"
import ItemView from "../elements/item/ItemView"
import ItemInfo from "../elements/item/ItemInfo"
import Header from "../elements/general/Header"
import LoginPopup from "../elements/general/AccountPopup/AccountPopup"
import Footer from "../elements/general/Footer"
import loadingGif from "../assets/loading_icon.gif"

import styles from "../styles/item.module.css"

export const ItemDataContext = createContext()
export const ItemStockContext = createContext()
export const ActiveColorContext = createContext()

export default function Item() {
    const [itemData, setItemData] = useState()
    const [activeColor, setActiveColor] = useState(0)
    const [itemStock, setItemStock] = useState()
    const [params, setSearchParams] = useSearchParams()

    const itemId = params.get("id")

    useEffect(() => {
        getItemData(itemId)
        getItemStock(itemId)
    }, [itemId])

    useEffect(() => {
        console.log(activeColor)
    }, [activeColor])

    useEffect(() => {
        const paramsColor = Number(params.get("c"))
        if (paramsColor !== null && paramsColor !== undefined) {
            setActiveColor(paramsColor)
        }
    }, [])

    async function getItemData(id) {
        const itemData = await getProductById(id)
        setItemData(itemData)
    }

    async function getItemStock(id) {
        const stock = await getProductStock(id)
        setItemStock(stock)
    }

    function changeActiveColor(color) {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev)
            if (color !== null && color !== undefined) {
                params.set("c", color)
            } else {
                params.delete("c")
            }
            return params
        })

        setActiveColor(color)
    }

    return(
        <>
            <Header/>
            <LoginPopup/>
                <Container>
                    <ItemStockContext.Provider value={[itemStock]}>
                        <ItemDataContext.Provider value={[itemData, setItemData]}>
                                <ActiveColorContext.Provider value={[activeColor, setActiveColor]}>
                                <div className={styles.productContainer}>
                                    {itemData ? <ItemView/> : <LoadingItemView/>}
                                    {itemData ? <ItemInfo/> : <h1>Loading...</h1>}
                                </div>
                            </ActiveColorContext.Provider>
                        </ItemDataContext.Provider>
                    </ItemStockContext.Provider>
                </Container>
            <Footer/>
        </>
    )
}

export function LoadingItemView() {
    return(
        <div className={styles.itemView}>
            <LoadingSlider />
            <div className={styles.thumbnails}>
                <div className={styles.thumbnail}><img src={loadingGif} alt="Loading..."/></div>
            </div>
        </div>
    )
}

function LoadingSlider() {
    return(
        <div className={styles.sliderContainer}>
            <div className={styles.slider}>
                <img src={loadingGif} className={styles.placeholder}/>
                <div className={styles.track}>
                    <div className={styles.slide}>
                        <img src={loadingGif} alt="Loading..."/>
                    </div>
                </div>
            </div>
        </div>
    )
}