import { createContext, useEffect, useState, useCallback } from "react"
import { getProductById, getProductStock } from "../api/productData"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useDbStatus } from "../customHooks/DbStatusProvider"
import { subscribeToDbReconnected, unsubscribeFromDbReconnected } from "../modules/dbStatus"

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
    const [loadFailed, setLoadFailed] = useState(false)
    const [params, setSearchParams] = useSearchParams()
    const { isConnected, checkConnection, isChecking } = useDbStatus()

    const itemId = params.get("id")

    const loadItem = useCallback(async () => {
        if (!itemId) return;
        setLoadFailed(false);
        const data = await getProductById(itemId);
        if (data && data.id) {
            setItemData(data);
            const stock = await getProductStock(itemId);
            setItemStock(stock);
        } else {
            setLoadFailed(true);
        }
    }, [itemId]);

    useEffect(() => {
        loadItem();
        subscribeToDbReconnected(loadItem);
        return () => unsubscribeFromDbReconnected(loadItem);
    }, [loadItem])

    useEffect(() => {
        console.log(activeColor)
    }, [activeColor])

    useEffect(() => {
        const paramsColor = Number(params.get("v"))
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

    return (
        <>
            <Header />
            <LoginPopup />
            <Container>
                <ItemStockContext.Provider value={[itemStock]}>
                    <ItemDataContext.Provider value={[itemData, setItemData]}>
                        <ActiveColorContext.Provider value={[activeColor, setActiveColor]}>
                            <div className={styles.productContainer}>
                                {itemData ? (
                                    <>
                                        <ItemView />
                                        <ItemInfo />
                                    </>
                                ) : (!isConnected || loadFailed) ? (
                                    <div className="db-offline-card w-100">
                                        <div className="mb-3">
                                            <span className="db-status-pulse" />
                                        </div>
                                        <h4>Unable to load product</h4>
                                        <div className="d-flex justify-content-center">
                                            <p className="text-muted text-center me-0">
                                                The database is currently offline or waking up.
                                            </p>
                                        </div>
                                        <button
                                            className="btn btn-dark"
                                            onClick={async () => {
                                                await checkConnection();
                                                loadItem();
                                            }}
                                            disabled={isChecking}
                                        >
                                            {isChecking ? "Checking..." : "Retry"}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <LoadingItemView />
                                        <h1>Loading...</h1>
                                    </>
                                )}
                            </div>
                        </ActiveColorContext.Provider>
                    </ItemDataContext.Provider>
                </ItemStockContext.Provider>
            </Container>
            <Footer />
        </>
    )
}

export function LoadingItemView() {
    return (
        <div className={styles.itemView}>
            <LoadingSlider />
            <div className={styles.thumbnails}>
                <div className={styles.thumbnail}><img src={loadingGif} alt="Loading..." /></div>
            </div>
        </div>
    )
}

function LoadingSlider() {
    return (
        <div className={styles.sliderContainer}>
            <div className={styles.slider}>
                <img src={loadingGif} className={styles.placeholder} />
                <div className={styles.track}>
                    <div className={styles.slide}>
                        <img src={loadingGif} alt="Loading..." />
                    </div>
                </div>
            </div>
        </div>
    )
}