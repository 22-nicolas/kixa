import { useEffect } from "react"
import Footer from "../elements/general/Footer"
import Header from "../elements/general/Header"
import LoginPopup from "../elements/general/LoginPopup"
import Container from "../elements/general/Container"
import Pricing from "../elements/search/Pricing"
import "../styles/search.css"

function Search() {
    

    return(
        <>
            <Header/>
            <LoginPopup/>

            <Container>
                <div className="search-ui">
                    <div className="filters">
                        <Pricing></Pricing>
                    </div>
                    <div></div>
                </div>
            </Container>
            

            <Footer/>
        </>
    )
}

export default Search