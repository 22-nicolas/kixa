import { createContext, useContext, useEffect, useRef, useState } from "react"
import { string } from "../../modules/colors.js"
import { ItemDataContext } from "../../pages/Item"
import { shoeAssetsPath } from "../../modules/utils"
import styles from "../../styles/item.module.css"
import loadingGif from "../../assets/loading_icon.gif"

const ActiveImgContext = createContext()

export default function ItemView() {
    const [itemData] = useContext(ItemDataContext)

    let [thumbnails, setThumbnails] = useState()
    let [activeImg, setActiveImg] = useState(1)

    useEffect(() => {
        const thumbnailsArray = Array.from({ length: itemData.imgs_per_colorway[itemData.color] })
        const thumbnailComponents = thumbnailsArray.map((_, i) => <Thumbnail key={i} i={i} itemData={itemData}/>)

        setThumbnails(thumbnailComponents)

    }, [itemData])

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
    const { id, color } = itemData
    const [activeImg, setActiveImg] = useContext(ActiveImgContext)
    const imgIndex = i + 1
    const isActive = activeImg === imgIndex

    return (
        <div className={`${styles.thumbnail} ${isActive ? styles.active : ""}`} onClick={() => {setActiveImg(imgIndex)}}>
            <img src={`${shoeAssetsPath}/${id}/${id}_${color + 1}_${imgIndex}.png`} alt={`image: ${imgIndex}`} />
        </div>
    )
}

function Slider() {
    let [itemData] = useContext(ItemDataContext)

    const {id, color, imgs_per_colorway} = itemData

    //map slides
    const slidesArray = Array.from({ length: imgs_per_colorway[color] })
    const slidesComponents = slidesArray.map((_, i) => <Slide key={i} imgSrc={`${shoeAssetsPath}/${id}/${id}_${color + 1}_${i + 1}.png`}/>)

    //move track according to selected thumbnail/activeImg
    const [activeImg, setActiveImg] = useContext(ActiveImgContext)
    const track = useRef()
    const placeholder = useRef()
    const startX = useRef(0)
    useEffect(() => {
        setTrackOffset()
        
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, [activeImg])

    //moves track to correct position without transition (used when resizing window to prevent sliding animation)
    function handleResize() {
        const transition = track.current.style.transition
        track.current.style.transition = "none"
        setTrackOffset()
        track.current.style.transition = transition
    }

    function setTrackOffset() {
        track.current.style.left = `-${placeholder.current.offsetWidth*(activeImg-1)}px`
    }

    function handleTouchStart(e) {
        startX.current = e.touches[0].clientX
    }

    function handleToucheEnd(e) {
        const endX = e.changedTouches[0].clientX
        const diff = endX - startX.current

        if (diff === 0) return

        if (diff > 0) {
            const nextSlide = Math.max(activeImg - 1, 1)
            if (nextSlide === activeImg) return
            setActiveImg(nextSlide)
        } else {
            const nextSlide = Math.min(activeImg + 1, slidesArray.length)
            if (nextSlide === activeImg) return
            setActiveImg(nextSlide)
        } 
    }

    return(
        <div className={styles.sliderContainer}>
            <div className={styles.slider} onTouchStart={handleTouchStart} onTouchEnd={handleToucheEnd}>
                <img src={`${shoeAssetsPath}/${id}/${id}_${color + 1}_1.png`} className={styles.placeholder} ref={placeholder}/>
                <div className={styles.track} ref={track}>
                    {slidesComponents}
                </div>
            </div>
        </div>
    )
}

function Slide({ imgSrc }) {
    const itemData = useContext(ItemDataContext)
    const {name, color} = itemData
    const img = useRef()

    function zoom(e) {
        console.log("zoom")
        if (e.pointerType !== "mouse") return

        const rect = img.current.getBoundingClientRect();

        const horizontal = ((e.clientX - rect.left) / rect.width) * 100;
        const vertical = ((e.clientY - rect.top) / rect.height) * 100;

        img.current.style.setProperty('--x', `${horizontal}%`);
        img.current.style.setProperty('--y', `${vertical}%`);
        img.current.style.setProperty('--zoom', '1.7');
    }

    return(
        <div className={styles.slide}>
            <img ref={img} onPointerMove={zoom} onPointerLeave={() => img.current.style.setProperty('--zoom', '1')} src={imgSrc} alt={`${name}, color: ${string(color)}`} />
        </div>
    )
}
