import { useContext, useEffect, useState } from "react"
import { string } from "../../modules/colors.js"
import { ItemDataContext } from "../../pages/Item"
import { shoeAssetsPath } from "../../modules/utils"
import styles from "../../styles/item.module.css"
import loadingGif from "../../assets/loading_icon.gif"

export default function ItemView() {
    const itemData = useContext(ItemDataContext)

    let [thumbnails, setThumbnails] = useState()

    useEffect(() => {
        if(!itemData) return

        const {id, imgs_per_colorway, activeColor} = itemData
        setThumbnails(Array.from({ length: imgs_per_colorway[activeColor] })
                            .map((_, i) => <div className={styles.thumbnail} key={i}><img src={`${shoeAssetsPath}/${id}/${id}_${activeColor + 1}_${i + 1}.png`} alt={`image: ${i + 1}`} /></div>))

    }, [itemData])

    if(!itemData) return <LoadingItemView/>

    return(
        <div className={styles.itemView}>
            <Slider itemData={itemData}/>

            <div className={styles.thumbnails}>
                {thumbnails}
            </div>
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

function Slider({ itemData }) {

    if(!itemData) return <LoadingSlider/>

    const {id, name, activeColor, colors} = itemData
    const [imgSrc, setImgSrc] = useState(`${shoeAssetsPath}/${id}/${id}_${activeColor + 1}_1.png`)

    return(
        <div className={styles.sliderContainer}>
            <div className={styles.slider}>
                <img src={imgSrc} className={styles.placeholder}/>
                <div className={styles.track}>
                    <div className={styles.slide}>
                        <img src={imgSrc} alt={`${name}, color: ${string(activeColor)}`} />
                    </div>
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