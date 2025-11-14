import Container from "../general/Container"
import '../../styles/index.css'
import hikingVid from "../../assets/hiking.mp4"
import skateVid from "../../assets/skate.mp4"
import runningImg from "../../assets/running.jpg"
import { isVideo } from "../../modules/utils"

const slidesData = [
    {src: hikingVid, txt: "Long Way? Your Shoes Can Handle It."},
    {src: skateVid, txt: "Built to Shred. Made to Last."},
    {src: runningImg, txt: "Built for Speed. Born to Race."}
]

function Slider() {
    
    const slides = initSlides(slidesData)



    return(
        <Container>
            <div className="slider">
                <div className="slider-track" id="sliderTrack">
                    {slides}
                </div>
                <div className="dots" id="dotsContainer"></div>
            </div>
        </Container>
    )
}
export default Slider

function initSlides(slidesData) {
    return slidesData.map((slideData, i) => {
        slideData.isVideo = isVideo(slideData.src)

        return(
        <div className="slide" key={i}>
            {slideData.isVideo ? <video className="contents" src={slideData.src} autoPlay muted loop/> : <img className="contents" src={slideData.src}/>}
            <h1>{slideData.txt}<p>KX</p></h1>
        </div>
        )
    })
}