import Container from "../general/Container"
import { isVideo } from "../../modules/utils"
import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { MissingPropError, InvalidPropTypeError } from "../../modules/utils"


function Slider({ slidesData, autoScrollDelay = 5000 }) {
    
    if (slidesData === undefined) {
        throw new MissingPropError("Slider requires the 'slidesData' prop.");
    }
    if (!Array.isArray(slidesData)) {
        throw new InvalidPropTypeError("'slidesData' must be an array.")
    }

    const delay = autoScrollDelay
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

            return <span key={i} className={isActive ? "active" : ""} onMouseDown={() => goToSlide(i)}/>
        })
    }

    function start() {
        clearInterval(sliderInterval.current); // clear existing interval if any
        sliderInterval.current = setInterval(() => nextSlide(), delay);
    }

    function nextSlide() {
        let nextSlide = currentSlide + 1
        if(nextSlide >= slidesData.length) nextSlide = 0
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
Slider.PropTypes = {
    slideData: PropTypes.array.isRequired,
    autoScrollDelay: PropTypes.number
}

export default Slider