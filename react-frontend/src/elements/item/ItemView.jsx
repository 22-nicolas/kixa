import { useContext, useEffect, useState } from "react"
import loadingGif from "../../assets/loading_icon.gif"
import { ItemDataContext } from "../../pages/Item"
import { shoeAssetsPath } from "../../modules/utils"
import styles from "../../styles/item.module.css"

export default function ItemView() {
    const itemData = useContext(ItemDataContext)
    

    return(
        <div className={styles.itemView}>
            <Slider itemData={itemData}/>

            <div className={styles.thumbnails}>

            </div>
        </div>
    )
}

function Slider({ itemData }) {
    if(!itemData) return
    const {id, activeColor, colors} = itemData
    const [imgSrc, setImgSrc] = useState(`${shoeAssetsPath}/${id}/${id}_${activeColor + 1}_1.png`)
    


    return(
        <div className={styles.sliderContainer}>
            <div className={styles.slider}>
                <img src={imgSrc} className={styles.placeholder}/>
                <div className={styles.track}>
                    <div className={styles.slide}>
                        <img src={imgSrc} alt="loading..." />
                    </div>
                </div>
            </div>
        </div>
    )
}