import { useEffect } from "react"
import Footer from "../elements/general/Footer"
import Header from "../elements/general/Header"
import LoginPopup from "../elements/general/LoginPopup"
import Container from "../elements/general/Container"
import Pricing from "../elements/search/Pricing"
import Color from "../elements/search/Color"
import Brand from "../elements/search/Brand"
import "../styles/search.css"
import { Colors } from "../modules/colors"
import { Brands } from "../modules/brands"

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
                        <Brand brands={Brands} />
                    </div>
                    <div></div>
                </div>
            </Container>
            

            <Footer/>
        </>
    )
}

export default Search