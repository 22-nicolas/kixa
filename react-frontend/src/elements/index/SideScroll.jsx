import PropTypes from "prop-types"
import { Link } from "react-router-dom"

export default function SideScroll({ items }) {
    if (!Array.isArray(items)) {
        console.error("'items' must be an array.")
        return null
    }

    const itemElements = items.map(({link, imgSrc, headline}, i) => {
        return(
            <Link key={i} to={link}>
                <div className="gradient"/>
                <img src={imgSrc} />
                <div className="corner-info">
                    <h1>{headline}</h1>
                    <button>Shop now</button>
                </div>
            </Link>
        )
    })

    return(
        <div className="side-scroll">
            <div className="side-scroll-slider">
                {itemElements}    
            </div>
        </div>
    )
}
SideScroll.PropTypes = {
    items: PropTypes.array.isRequired
}