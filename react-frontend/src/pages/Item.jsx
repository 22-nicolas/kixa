import { createContext, useEffect, useState } from "react"
import { getProductById } from "../api/productData"
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

export default function Item() {
    const [itemData, setItemData] = useState()
    const navigate = useNavigate()
    const [params] = useSearchParams()

    useEffect(() => {
        getItemData(params.get("id"), params.get("c"))
    }, [params])

    async function getItemData(id, color) {
        const itemData = await getProductById(id)
        itemData.color = Number(color)
        setItemData(itemData)
    }

    return(
        <>
            <Header/>
            <LoginPopup/>

            <Container>
                <ItemDataContext.Provider value={[itemData, setItemData]}>
                    <div className={styles.productContainer}>
                        {itemData ? <ItemView/> : <LoadingItemView/>}
                        {itemData ? <ItemInfo/> : <h1>Loading...</h1>}
                    </div>
                </ItemDataContext.Provider>
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