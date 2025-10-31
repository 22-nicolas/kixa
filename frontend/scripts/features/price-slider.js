import { search } from "./search.js"

export function initPriceSlider() {
    const slider = getSlider();

    slider.minRange.addEventListener('input', updateRange);
    slider.maxRange.addEventListener('input', updateRange);

    slider.minNum.addEventListener('input', updateSlider);
    slider.maxNum.addEventListener('input', updateSlider);

    window.addEventListener('resize', updateRange);

    updateRange();

    let applyButton = document.querySelector('.apply-button');
    applyButton.addEventListener('click', () => search())
}

export function getSlider() {
    const slider = {
        minRange: document.getElementById('min'),
        maxRange: document.getElementById('max'),
        minNum: document.getElementById('minNum'),
        maxNum: document.getElementById('maxNum'),
        range: document.getElementById('range'),
    }

    return slider;
}

export function updateSlider(minValue, maxValue) {
    const slider = getSlider();

    if (!minValue || !maxValue) {
        minValue = slider.minNum.value;
        maxValue = slider.minNum.value;
    }

    slider.minRange.value = minValue;
    slider.maxRange.value = maxValue;

    updateRange();
}

function updateRange() {
    const slider = getSlider();

    let minValue = parseInt(slider.minRange.value);
    let maxValue = parseInt(slider.maxRange.value);

    if (minValue > maxValue) {
        minValue = slider.maxRange.value;
        maxValue = slider.minRange.value;
    } else{
        minValue = slider.minRange.value;
        maxValue = slider.maxRange.value;
    }


    slider.minNum.value = minValue;
    slider.maxNum.value = maxValue;

    const minInPixels = (minValue - slider.minRange.min) / (slider.minRange.max - slider.minRange.min) * slider.minRange.offsetWidth
    const maxInPixels = (maxValue - slider.maxRange.min) / (slider.maxRange.max - slider.maxRange.min) * slider.maxRange.offsetWidth

    const rangeInPixels = maxInPixels-minInPixels;

    slider.range.style.transform = `translateX(${minInPixels}px) scaleX(${(rangeInPixels) / (slider.minRange.offsetWidth)})`;

}