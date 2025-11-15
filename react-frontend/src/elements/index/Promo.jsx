import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { isImage } from "../../modules/utils"

function Promo({ headline, info, buttonLabel, imgSrc, link }) {
    if (!buttonLabel) buttonLabel = "Shop now"
    if (!isImage(imgSrc)) {
        console.warn(`${imgSrc} is not an image`)
        imgSrc = null
    }

    return(
        <Link className="promo" to={link}>
            <img src={imgSrc} alt={headline} />
            <div className="corner-info">
                <p>{info}</p>
                <h1>{headline}</h1>
                <button>{buttonLabel}</button>
            </div>
        </Link>
    )
}
Promo.propTypes = {
    headline: PropTypes.string,
    info: PropTypes.string,
    buttonLabel: PropTypes.string,
    imgSrc: PropTypes.string,
    link: PropTypes.string
}

export default Promo