export default class Slider {
    constructor(containerSelector) {
        this.slider = document.querySelector('.slider');
        this.contents = this.slider.querySelectorAll('.contents');
        this.track = this.slider.querySelector('.slider-track');
        this.dotsContainer = this.slider.querySelector('.dots')
        this.currentSlide = 0;
        this.sliderInterval;
        this.delay = 5000;
        this.spans = [];

        this.init();
    }

    init() {
        this.createDots();
        this.updateSpans();
        this.matchWidth();
        this.start();

        window.addEventListener('resize', this.matchWidth);
    }

    createDots() {
        for (let i = 0; i < this.contents.length; i++) {
            const dot = document.createElement('span');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
            this.spans.push(dot);
        }
    }

    nextSlide() {
        if(this.currentSlide < this.contents.length-1) {
            this.currentSlide++
            this.track.style.left = `-${this.currentSlide*this.slider.offsetWidth}px`;
            this.updateSpans();
        } else{
            this.currentSlide = 0;
            this.track.style.left = `-${this.currentSlide*this.slider.offsetWidth}px`;
            this.updateSpans();
        }
    }

    goToSlide(index) {
        this.track.style.left = `-${index*this.slider.offsetWidth}px`;
        this.currentSlide = index;
        this.updateSpans();
        this.start();
    }

    start() {
        clearInterval(this.sliderInterval); // clear existing interval if any
        this.sliderInterval = setInterval(() => this.nextSlide(), this.delay);
    }

    updateSpans() {
        for (let i = 0; i < this.spans.length; i++) {
            this.spans[i].classList.remove('active');
            this.spans[this.currentSlide].classList.add('active');
        }
    }

    matchWidth() {
        for (let i = 0; i < this.contents.length; i++) {
            this.contents[i].style.width = this.slider.offsetWidth + 'px';
        }
    }
}