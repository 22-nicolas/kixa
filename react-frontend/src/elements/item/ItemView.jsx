import { createContext, useContext, useEffect, useRef, useState } from "react"
import { string } from "../../modules/colors.js"
import { ItemDataContext } from "../../pages/Item"
import { shoeAssetsPath } from "../../modules/utils"
import styles from "../../styles/item.module.css"
import loadingGif from "../../assets/loading_icon.gif"

const ActiveImgContext = createContext()

export default function ItemView() {
    const itemData = useContext(ItemDataContext)

    let [thumbnails, setThumbnails] = useState()
    let [activeImg, setActiveImg] = useState(1)

    useEffect(() => {
        if(!itemData) return
        const thumbnailsArray = Array.from({ length: itemData.imgs_per_colorway[itemData.paramColor] })
        const thumbnailComponents = thumbnailsArray.map((_, i) => <Thumbnail key={i} i={i} itemData={itemData}/>)

        setThumbnails(thumbnailComponents)

    }, [itemData, activeImg])

    if(!itemData) return <LoadingItemView/>

    return(
        <ActiveImgContext.Provider value={[activeImg, setActiveImg]}>
            <div className={styles.itemView}>
                <Slider itemData={itemData}/>

                <div className={styles.thumbnails}>
                    {thumbnails}
                </div>
            </div>
        </ActiveImgContext.Provider>
    )
}

function Thumbnail({ itemData, i }) {
    const { id, paramColor } = itemData
    const [activeImg, setActiveImg] = useContext(ActiveImgContext)
    const imgIndex = i + 1
    const isActive = activeImg === imgIndex

    return (
        <div className={`${styles.thumbnail} ${isActive ? styles.active : ""}`} onClick={() => {setActiveImg(imgIndex)}}>
            <img src={`${shoeAssetsPath}/${id}/${id}_${paramColor + 1}_${imgIndex}.png`} alt={`image: ${imgIndex}`} />
        </div>
    )
}

function LoadingItemView() {
    return(
        <div className={styles.itemView}>
            <Slider itemData={null}/>

            <div className={styles.thumbnails}>
                <div className={styles.thumbnail}><img src={loadingGif} alt="Loading..."/></div>
            </div>
        </div>
    )
}

function Slider() {

    if(!useContext(ItemDataContext)) return <LoadingSlider/>

    const {id, paramColor, imgs_per_colorway} = useContext(ItemDataContext)

    //map slides
    const slidesArray = Array.from({ length: imgs_per_colorway[paramColor] })
    const slidesComponents = slidesArray.map((_, i) => <Slide key={i} imgSrc={`${shoeAssetsPath}/${id}/${id}_${paramColor + 1}_${i + 1}.png`}/>)

    //move track according to selected thumbnail/activeImg
    const [activeImg] = useContext(ActiveImgContext)
    const track = useRef()
    const placeholder = useRef()
    useEffect(() => {
        track.current.style.left = `-${placeholder.current.offsetWidth*(activeImg-1)}px`
    }, [activeImg])

    return(
        <div className={styles.sliderContainer}>
            <div className={styles.slider}>
                <img src={`${shoeAssetsPath}/${id}/${id}_${paramColor + 1}_1.png`} className={styles.placeholder} ref={placeholder}/>
                <div className={styles.track} ref={track}>
                    {slidesComponents}
                </div>
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

function Slide({ imgSrc }) {
    const {name, paramColor} = useContext(ItemDataContext)
    const img = useRef()

    function zoom(e) {
        const rect = img.current.getBoundingClientRect();

        const horizontal = ((e.clientX - rect.left) / rect.width) * 100;
        const vertical = ((e.clientY - rect.top) / rect.height) * 100;

        img.current.style.setProperty('--x', `${horizontal}%`);
        img.current.style.setProperty('--y', `${vertical}%`);
    }

    return(
        <div className={styles.slide}>
            <img ref={img} onMouseMove={(e) => zoom(e)} src={imgSrc} alt={`${name}, color: ${string(paramColor)}`} />
        </div>
    )
}