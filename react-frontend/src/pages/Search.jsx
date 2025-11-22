import { useEffect } from "react"
import Footer from "../elements/general/Footer"
import Header from "../elements/general/Header"
import LoginPopup from "../elements/general/LoginPopup"
import Container from "../elements/general/Container"
import Pricing from "../elements/search/Pricing"
import Color from "../elements/search/Color"
import "../styles/search.css"
import { Colors } from "../modules/colors"

function Search() {
    

    return(
        <>
            <Header/>
            <LoginPopup/>

            <Container>
                <div className="search-ui">
                    <div className="filters">
                        <Pricing/>
                        <Color colors={Colors}/>
                    </div>
                    <div></div>
                </div>
            </Container>
            

            <Footer/>
        </>
    )
}

export default Search