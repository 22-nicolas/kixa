import { replaceCharAt } from "../utils/utils.js";
import { getProductById } from "../utils/frontend.js";
import { addToCart } from "./cart.js";

export async function loadItemAssets() {
    let params = new URLSearchParams(window.location.search);
    const reqId = params.get("id")
    const {id, name, price, colors, brand, sizes, description, variants, type, imgs_per_colorway} = await getProductById(reqId);
    
    document.getElementById('product-name').textContent = name;
    document.getElementById('product-description').textContent = description;
    document.querySelector('.price').textContent = `${price}$`

    //colorways
    let colorways = document.querySelector('.color-ways');
    let colorwaysHTML = "";
    for (let i = 0; i < variants; i++) {
        colorwaysHTML += `
        <div class="color-way" id="${i}">
            <img src="imgs/shoes/${id}/${id}_${i+1}_1.png">
        </div>`;   
    }

    colorways.innerHTML = colorwaysHTML;

    document.querySelectorAll('.color-way').forEach(colorSelector => colorSelector.addEventListener('click', () => changeColorway(parseInt(colorSelector.id))));

    //sizes
    let sizeSelect = document.querySelector('.size-select');
    let sizeSelectors = "";
    for (let i = 0; i < sizes.length; i++) {
        sizeSelectors += `
        <button class="size">
            EU ${sizes[i]}
        </button>`;   
    }

    sizeSelect.innerHTML = sizeSelectors;

    document.querySelectorAll('.size').forEach(sizeSelect => sizeSelect.addEventListener('click', () => changeSize()));
    
    
    let colorReq = params.get("color")
    let color;
    if (!colorReq) {
        color = 0;
    } else {
        color = parseInt(colorReq)
    }
    changeColorway(color)   //change colorway initializes slider and thumbnail imgs so no need to do seperatly
    const cartBTN = document.querySelector('.add-cart-button')
    cartBTN.addEventListener('click', () => addToCart(id, getActiveColor()));
}

async function changeColorway(color) {
    //sets colorway selector to active
    const colors = document.querySelectorAll('.color-way');
    for (let i = 0; i < colors.length; i++) {
        colors[i].classList.remove('active');
    }
    colors[color].classList.add('active');


    //preview/slider imgs
    let slider = document.querySelector('.slider');
    let params = new URLSearchParams(window.location.search);
    const id = params.get("id")
    const product = await getProductById(id);
    let sliderHTML = `<img src="imgs/shoes/${id}/${id}_1_1.png" class="placeholder"> <div class="track">`;
    for (let i = 0; i < product.imgs_per_colorway[color]; i++) {
        sliderHTML += `
            <div class="slide">
                <img src="imgs/shoes/${id}/${id}_${color+1}_${i+1}.png">
            </div>
        `;
    }
    sliderHTML += '</div>'

    slider.innerHTML = sliderHTML

    //thumbnails imgs
    let thumbnails = document.querySelector('.product-container .thumbnails');
    let thumbnailsHTML = "";
    for (let i = 0; i < product.imgs_per_colorway[0]; i++) {
        thumbnailsHTML += `
        <div class="thumbnail" id=${i}>
            <img src="imgs/shoes/${id}/${id}_${color+1}_${i+1}.png">
        </div>
        `;
    }
    thumbnails.innerHTML = thumbnailsHTML;

    //links up scripts to html
    document.querySelectorAll('.thumbnail').forEach((thumbnail, i) => thumbnail.addEventListener('click', () => jumpToSlide(parseInt(thumbnail.id))));
    zoom();
    setUpSlider();
}

function getActiveColor() {
    return document.querySelector('.color-way.active').id
}

function zoom() {
    document.querySelectorAll('.slider img').forEach(elem => {
        let x,y, width, height;
        elem.onmouseenter = () => {
            const size = elem.getBoundingClientRect();

            x = size.x;
            y = size.y;
            width = size.width;
            height = size.height;

        };

        elem.onmousemove = e => {
            const horizontal = (e.clientX - x) / width*100;
            const vertical = (e.clientY - y) / height*100;

            elem.style.setProperty('--x', horizontal + '%');
            elem.style.setProperty('--y', vertical + '%');
        };
    });
}

function getSlider() {
    const imgs = document.querySelectorAll('.slide img');
    const track = document.querySelector('.track');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const slider = {imgs, track, thumbnails};
    return slider;
}

function setUpSlider() {
    let slider = getSlider();

    slider.thumbnails[0].classList.add('active');
}

function jumpToSlide(i) {
    let {imgs, track, thumbnails} = getSlider();

    track.style.left = `-${imgs[i].offsetWidth*i+1}px`;

    for (let index = 0; index < thumbnails.length; index++) {
        if(i == index){
            thumbnails[index].classList.add('active');
        }else{
            thumbnails[index].classList.remove('active');
        }
    }
}

function changeSize() {
    const sizes = document.querySelectorAll('.size')
    let activeSize = document.querySelector('.size:hover')
    for (let i = 0; i < sizes.length; i++) {
        sizes[i].classList.remove('active');
    }
    activeSize.classList.add('active');
}