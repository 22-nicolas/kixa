import Header from "../elements/general/Header"
import LoginPopup from "../elements/general/LoginPopup"
import Slider from "../elements/index/Slider"
import Promo from "../elements/index/Promo"

//assets
import neymarPromo from "../assets/neymar.png"

function Index() {
    const i = 0
    return(
        <>
            <Header/>
            <LoginPopup/>
            <Slider/>
            <Promo headline="Check out our sortiment!" info="Future 8 Ultimate Creativity FG" imgSrc={neymarPromo} />
        </>
    )
}

export default Index