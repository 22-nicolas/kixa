import Container from "../general/Container"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import styles from "../../styles/index.module.css"

export default function ImgLinks({ linksData }) {
    if (!Array.isArray(linksData)) {
        console.error("'linksData' must be an array.")
        return null
    }

    const links = linksData.map(({link, imgSrc, headline, info}, i) => {
        return(
            <Link key={i} to={link}>
                <img src={imgSrc}/>
                <div className={styles.cornerInfo}>
                    <p>{info}</p>
                    <h1>{headline}</h1>
                    <button>Shop now</button>
                </div>
            </Link>
        )
    })

    return(
        <Container>
            <div className={styles.imgLinks}>
                {links}
            </div>
        </Container>
    )
}
ImgLinks.PropTypes = {
    linksData: PropTypes.array
}