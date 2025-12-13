import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getProductIdFromSrc } from "../../modules/utils.js"
import { getProductById } from "../../api/productData.js"
import styles from "../../styles/index.module.css"

export default function SideScroll({ items }) {
    if (!Array.isArray(items)) {
        console.error("'items' must be an array.")
        return null
    }

    const itemElements = items.map(({link, imgSrc}, i) => {
        return(
            <Item key={i} link={link} imgSrc={imgSrc} />
        )
    })

    return(
        <div className={styles.sideScroll}>
            <div className={styles.sideScrollSlider}>
                {itemElements}    
            </div>
        </div>
    )
}
SideScroll.PropTypes = {
    items: PropTypes.array.isRequired
}

function Item({ link, imgSrc }) {
    
    const [headline, setHeadline] = useState("")

    useEffect(() => {
        getHeadline()
    }, [imgSrc])

    async function getHeadline() {
        const id = await getProductIdFromSrc(imgSrc)
        const {name} = await getProductById(id)
        setHeadline(name)
    }

    return(
        <Link to={link}>
            <div className={styles.gradient}/>
            <img src={imgSrc} />
            <div className={styles.cornerInfo}>
                <h1>{headline}</h1>
                <button>Shop now</button>
            </div>
        </Link>
    )
}
Item.PropTypes = {
    link: PropTypes.string,
    imgSrc: PropTypes.string.isRequired
}