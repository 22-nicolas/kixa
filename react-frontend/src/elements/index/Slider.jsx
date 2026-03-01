import Container from "../general/Container"
import { isVideo } from "../../modules/utils"
import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import styles from "../../styles/index.module.css"

function Slider({ slidesData, autoScrollDelay = 5000 }) {

    if (!Array.isArray(slidesData)) {
        console.error("'slidesData' must be an array.")
        return null
    }
    if (typeof(autoScrollDelay) !== "number") {
        console.error("'autoScrollDelay' must be a number.")
        return null
    }

    const delay = autoScrollDelay
    const [currentSlide, setCurrentSlide] = useState(0)
    const slider = useRef()
    const track = useRef()
    const slidesRef = useRef([])
    const slides = initSlides()
    let sliderInterval = useRef()
    let dots = initDots()
    
    useEffect(() => {
        start()

        return () => clearInterval(sliderInterval.current);
    }, [])

    function initSlides() {
        return slidesData.map((slideData, i) => {
            slideData.isVideo = isVideo(slideData.src)

            return(
            <div className={styles.slide} key={i} ref={slide => slidesRef.current[i] = slide}>
                {slideData.isVideo ? 
                    <video className={styles.contents} src={slideData.src} autoPlay muted loop/> :
                    <img className={styles.contents} src={slideData.src}/>
                }
                <h1>{slideData.txt}<p>KX</p></h1>
            </div>
            )
        })
    }

    function initDots(){
        return slidesData.map((_, i) => {
            return <span key={i} className={i === currentSlide ? styles.active : ""} onMouseDown={() => goToSlide(i)}/>
        })
    }

    function start() {
        clearInterval(sliderInterval.current); // clear existing interval if any
        sliderInterval.current = setInterval(() => nextSlide(), delay);
    }

    function nextSlide() {
        setCurrentSlide(prev => {
                const next = (prev + 1) % slidesData.length
                track.current.style.transform = `translateX(-${next * 100}%)`;
                return next
            })
    }

    function goToSlide(i, stopAutoScroll = true) {
        track.current.style.transform = `translateX(-${i * 100}%)`;
        setCurrentSlide(i)
        if(stopAutoScroll) start()
    }

    return(
        <Container>
            <div ref={slider} className={styles.slider}>
                <div ref={track} className={styles.sliderTrack} id="sliderTrack">
                    {slides}
                </div>
                <div className={styles.dots}>
                    {dots}
                </div>
            </div>
        </Container>
    )
}
Slider.propTypes = {
    slideData: PropTypes.array.isRequired,
    autoScrollDelay: PropTypes.number
}

export default Slider