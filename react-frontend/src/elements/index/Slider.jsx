import Container from "../general/Container"
import '../../styles/index.css'
import hikingVid from "../../assets/hiking.mp4"
import skateVid from "../../assets/skate.mp4"
import runningImg from "../../assets/running.jpg"
import { isVideo } from "../../modules/utils"
import { useEffect, useRef, useState } from "react"


function Slider() {
    
    const slidesData = [
        {src: hikingVid, txt: "Long Way? Your Shoes Can Handle It."},
        {src: skateVid, txt: "Built to Shred. Made to Last."},
        {src: runningImg, txt: "Built for Speed. Born to Race."}
    ]
    const delay = 3200
    const [currentSlide, setCurrentSlide] = useState(0)
    const slider = useRef()
    const track = useRef()
    const contents = useRef([])
    const slides = initSlides()
    let sliderInterval = useRef()
    let dots = initDots()
    
    useEffect(() => {
        matchWidth()
        start()
        window.addEventListener('resize', matchWidth);
    }, [])
    
    useEffect(() => {
        dots = initDots()
        start()
    }, [currentSlide])

    function initSlides() {
        return slidesData.map((slideData, i) => {
            slideData.isVideo = isVideo(slideData.src)

            return(
            <div className="slide" key={i}>
                {slideData.isVideo ? 
                    <video className="contents" ref={content => contents.current[i] = content} src={slideData.src} autoPlay muted loop/> :
                    <img className="contents" ref={content => contents.current[i] = content} src={slideData.src}/>
                }
                <h1>{slideData.txt}<p>KX</p></h1>
            </div>
            )
        })
    }

    function initDots(){
        return slidesData.map((_, i) => {
            let isActive = false
            if (i === currentSlide) isActive = true

            return <Dot key={i} className={isActive ? "active" : ""} onMouseDown={() => goToSlide(i)}/>
        })
    }

    function start() {
        clearInterval(sliderInterval.current); // clear existing interval if any
        sliderInterval.current = setInterval(() => nextSlide(), delay);
    }

    function nextSlide() {
        let nextSlide = currentSlide + 1
        if(nextSlide >= slidesData.length) nextSlide = 0
        console.log(nextSlide)
        goToSlide(nextSlide)
    }

    function goToSlide(i){
        track.current.style.left = `-${i*slider.current.offsetWidth}px`;
        setCurrentSlide(i)
    }

    function matchWidth() {
        for (let i = 0; i < contents.current.length; i++) {
            contents.current[i].style.width = slider.current.offsetWidth + 'px';
        }
    }

    return(
        <Container>
            <div ref={slider} className="slider">
                <div ref={track} className="slider-track" id="sliderTrack">
                    {slides}
                </div>
                <div className="dots">
                    {dots}
                </div>
            </div>
        </Container>
    )
}
export default Slider

function Dot({ className, onMouseDown}) {
    return <span className={className} onMouseDown={onMouseDown}></span>
}
