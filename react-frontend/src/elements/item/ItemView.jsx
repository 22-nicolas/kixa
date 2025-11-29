import { useContext, useEffect, useState } from "react"
import loadingGif from "../../assets/loading_icon.gif"
import { ItemDataContext } from "../../pages/Item"
import { shoeAssetsPath } from "../../modules/utils"

export default function ItemView() {
    const itemData = useContext(ItemDataContext)
    

    return(
        <div className="item-view">
            <Slider itemData={itemData}/>

            <div className="thumbnails">

            </div>
        </div>
    )
}

function Slider({ itemData }) {
    if(!itemData) return
    const {id, activeColor, colors} = itemData
    const [imgSrc, setImgSrc] = useState(`${shoeAssetsPath}/${id}/${id}_${activeColor}_1.png`)
    


    return(
        <div className="slider-container">
            <div className="slider">
                <img src={imgSrc} className="placeholder"/>
                <div className="track">
                    <div className="slide">
                        <img src={imgSrc} alt="loading..." />
                    </div>
                </div>
            </div>
        </div>
    )
}