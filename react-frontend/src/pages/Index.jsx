//components
import Header from "../elements/general/Header"
import LoginPopup from "../elements/general/AccountPopup/AccountPopup"
import Footer from "../elements/general/Footer"
import Slider from "../elements/index/Slider"
import Promo from "../elements/index/Promo"
import ImgLinks from "../elements/index/ImgLinks"
import SideScroll from "../elements/index/SideScroll"

//assets
//slider
import hikingVid from "../assets/hiking.mp4"
import skateVid from "../assets/skate.mp4"
import runningImg from "../assets/running.jpg"
//promo
import neymarPromo from "../assets/neymar.png"
//img links
import speedcatPreview from "../assets/speedcat_preview.png"
import adidasXbraindeadPreview from "../assets/adidas_x_brain_dead.png"
import gelcumulusPreview from "../assets/asics.png"
import jordansPreview from "../assets/nike_sb.jpg"
//side scroll
import predator_elite_sg from "../assets/shoes/predator_elite_sg/predator_elite_sg_1_1.png"
import nike_air_max_plus from "../assets/shoes/nike_air_max_plus/nike_air_max_plus_1_1.png"
import adidas_campus from "../assets/shoes/adidas_campus/adidas_campus_1_1.png"
import japan_lo_brain_dead from "../assets/shoes/japan_lo_brain_dead/japan_lo_brain_dead_1_1.png"
import nike_air_force from "../assets/shoes/nike_air_force/nike_air_force_1_1.png"

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
            <ImgLinks linksData={[
                {link: "/item?id=puma_speedcat_og", imgSrc: speedcatPreview, headline: "Puma Speedcat OG", info: "Live Fast"},
                {link: "/item?id=japan_lo_brain_dead", imgSrc: adidasXbraindeadPreview, headline: "Adidas x Brain Dead", info: "A slam of sport and subculture."},
                {link: "/item?id=gel_cumulus_16", imgSrc: gelcumulusPreview, headline: "Gel-Cumulus 16", info: "Feel Comfort, Find Energy"},
                {link: "/item?id=jordan_1_chicago_sb_dunks", imgSrc: jordansPreview, headline: "Jordan 1 Chicago SB Dunks", info: "A timless look."}
            ]} />
            <SideScroll items={[
                {link: "/item?id=predator_elite_sg", imgSrc: predator_elite_sg},
                {link: "/item?id=nike_air_max_plus", imgSrc: nike_air_max_plus},
                {link: "/item?id=adidas_campus", imgSrc: adidas_campus},
                {link: "/item?id=japan_lo_brain_dead", imgSrc: japan_lo_brain_dead},
                {link: "/item?id=nike_air_force", imgSrc: nike_air_force}
            ]} />

            <Footer/>
        </>
    )
}

export default Index