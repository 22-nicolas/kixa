import Container from "../general/Container"
import '../../styles/index.css'
import hikingVid from "../../assets/hiking.mp4"
import skateVid from "../../assets/skate.mp4"
import runningImg from "../../assets/running.jpg"

function Slider() {
    return(
        <Container>
            <div className="slider">
                <div className="slider-track" id="sliderTrack">
                    <div className="slide"><video className="contents" src={hikingVid} autoPlay muted loop></video><h1>Long Way? Your Shoes Can Handle It.<p>KX</p></h1></div>
                    <div className="slide"><video className="contents" src={skateVid} autoPlay muted loop></video><h1>Built to Shred. Made to Last.<p>KX</p></h1></div>
                    <div className="slide"><img className="contents" src={runningImg}/><h1>Built for Speed. Born to Race.<p>KX</p></h1></div>
                </div>
                <div className="dots" id="dotsContainer"></div>
            </div>
        </Container>
    )
}

export default Slider