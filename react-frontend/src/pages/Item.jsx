import { createContext, useEffect, useState } from "react"
import { getProductById } from "../modules/api"
import { useNavigate, useSearchParams } from "react-router-dom"

import Container from "../elements/general/Container"
import ItemView from "../elements/item/ItemView"
import ItemInfo from "../elements/item/ItemInfo"
import Header from "../elements/general/Header"
import LoginPopup from "../elements/general/LoginPopup"
import Footer from "../elements/general/Footer"

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
        const itemsData = await getProductById(id)
        itemsData.activeColor = Number(color)
        setItemData(itemsData)
    }

    return(
        <>
            <Header/>
            <LoginPopup/>

            <Container>
                <ItemDataContext value={itemData}>
                    <div className={styles.productContainer}>
                        <ItemView></ItemView>
                        <ItemInfo></ItemInfo>
                    </div>
                </ItemDataContext>
            </Container>

            <Footer/>
        </>
    )
}