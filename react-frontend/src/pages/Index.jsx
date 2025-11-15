//components
import Header from "../elements/general/Header"
import LoginPopup from "../elements/general/LoginPopup"
import Slider from "../elements/index/Slider"
import Promo from "../elements/index/Promo"

//styles
import "../styles/index.css"

//assets
import hikingVid from "../assets/hiking.mp4"
import skateVid from "../assets/skate.mp4"
import runningImg from "../assets/running.jpg"
import neymarPromo from "../assets/neymar.png"

function Index() {
    return(
        <>
            <Header/>
            <LoginPopup/>

            <Slider slidesData={[
                {src: hikingVid, txt: "Long Way? Your Shoes Can Handle It."},
                {src: skateVid, txt: "Built to Shred. Made to Last."},
                {src: runningImg, txt: "Built for Speed. Born to Race."}
            ]} autoScrollDelay={3200}/>
            <Promo headline="Check out our sortiment!" info="Future 8 Ultimate Creativity FG" imgSrc={neymarPromo} />
        </>
    )
}

export default Index