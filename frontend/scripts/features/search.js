import { format } from "../utils/utils.js";
import { replaceCharAt } from "../utils/utils.js";
import { getProductData } from "../utils/frontend.js";

export function initSearchbar() {
    const searchbar = document.getElementById('searchbar');

    searchbar.addEventListener('keypress', (event) => {
        if (event.key == 'Enter') {
            search();
        }
    })
}

export function initPriceSlider() {
    const slider = getSlider();

    slider.min.addEventListener('input', updateRange);
    slider.max.addEventListener('input', updateRange);

    slider.minInput.addEventListener('input', updateSlider);
    slider.maxInput.addEventListener('input', updateSlider);

    window.addEventListener('resize', updateRange);

    updateRange();

    let applyButton = document.querySelector('.apply-button');
    applyButton.addEventListener('click', () => search())
}

function getSlider() {
    const slider = {
        min: document.getElementById('min'),
        max: document.getElementById('max'),
        minInput: document.getElementById('minNum'),
        maxInput: document.getElementById('maxNum'),
        range: document.getElementById('range'),
    }

    return slider;
}

function updateRange() {
    const slider = getSlider();

    let minValue = parseInt(slider.min.value);
    let maxValue = parseInt(slider.max.value);

    if (minValue > maxValue) {
        minValue = slider.max.value;
        maxValue = slider.min.value;
    } else{
        minValue = slider.min.value;
        maxValue = slider.max.value;
    }


    slider.minInput.value = minValue;
    slider.maxInput.value = maxValue;

    const minInPixels = (minValue - slider.min.min) / (slider.min.max - slider.min.min) * slider.min.offsetWidth
    const maxInPixels = (maxValue - slider.max.min) / (slider.max.max - slider.max.min) * slider.max.offsetWidth

    const rangeInPixels = maxInPixels-minInPixels;

    slider.range.style.transform = `translateX(${minInPixels}px) scaleX(${(rangeInPixels) / (min.offsetWidth)})`;

}

function updateSlider() {
    const slider = getSlider();

    slider.min.value = slider.minInput.value;
    slider.max.value = slider.maxInput.value;

    updateRange();
}

export function initChecks() {
    const spans = document.querySelectorAll('.color span');
    for (let i = 0; i < spans.length; i++) {
        spans[i].style.backgroundColor = spans[i].parentElement.htmlFor;
    }

    let colorChecks = document.querySelectorAll('.color input');
    for (let i = 0; i < colorChecks.length; i++) {
        colorChecks[i].addEventListener('click', () => search());
    }
    let brandChecks = document.querySelectorAll('.brand input');
    for (let i = 0; i < brandChecks.length; i++) {
        brandChecks[i].addEventListener('click', () => search());
    } 
}

export function initSort() {
    const currentParam = document.getElementById('sort-params');
    const params = document.querySelectorAll('.sort-dropdown p');
    const checkInput = document.getElementById('sort-dropdown-input')

    params.forEach(param => param.addEventListener('click', function(event) {
        //swap text content
        const lastParam = currentParam.textContent
        currentParam.textContent = param.textContent
        param.textContent = lastParam

        //hide dropdown
        checkInput.checked = false;
        //sort params in alphabetical order
        const sortDropdown = document.querySelector('.sort-dropdown');
        const sorted = Array.from(params).sort((a, b) => {
            return a.textContent.localeCompare(b.textContent);
        });
        sortDropdown.innerHTML = "";
        sorted.forEach(item => sortDropdown.appendChild(item));

        applySort();
    }));
}

async function applySort() {
    const list = document.querySelector('.item-container');
    const itemsData = await getProductData();
    const items = Array.from(list.querySelectorAll('.item'));
    const params = document.getElementById('sort-params').textContent.trim();
    const searchTerm = document.getElementById('searchbar').value.trim().toLowerCase();

    function sortItems(compareFn) {
        const sorted = [...itemsData].sort(compareFn);
        list.innerHTML = "";
        sorted.forEach(itemsData => {
            const {id} = itemsData;
            items.forEach(item => {
                if (item.id == id) {
                    list.appendChild(item);
                }
            });
        });
    }

    if (params === "best match") {
        //Fallback: alphabetical order
        if (searchTerm === "" || !searchTerm) {
            sortItems((a, b) => {
                const nameA = (a.name).toLowerCase();
                const nameB = (b.name).toLowerCase();
                return nameA.localeCompare(nameB);
            });
        } else {
            sortItems((a, b) => {
                const nameA = (a.name).toLowerCase();
                const nameB = (b.name).toLowerCase();

                const indexA = nameA.indexOf(searchTerm);
                const indexB = nameB.indexOf(searchTerm);

                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;

                return indexA - indexB;
            });
        }
    }

    if (params === "price (lowest to highest)") {
        sortItems((a, b) => {
            return parseFloat(a.price) - parseFloat(b.price);
        });
    }

    if (params === "price (highest to lowest)") {
        sortItems((a, b) => {
            return parseFloat(b.price) - parseFloat(a.price);
        });
    }
}

export async function createItems() {
    //gets search params from the url
    const params = new URLSearchParams(window.location.search);
    const itemContainer = document.querySelector(".item-container");

    //keeps searchbar text content and filters consistent with the last page
    let searchText = params.get("searchText");
    searchbar.value = searchText;
    
    const slider = getSlider();
    let min = params.get("min");
    let max = params.get("max");
    if(params.get("min")) {
        slider.minInput.value = min;
        slider.maxInput.value = max;
    }
    updateSlider();
    
    // get active color and brand IDs (as integers to match dataset)
    let colorChecks = document.querySelectorAll('.color input');
    let activeColors = params.get("colors") || [];
    if(activeColors){
        for (let i = 0; i < activeColors.length; i++) {
            colorChecks[activeColors[i]].checked = true
        }
    }

    let brandChecks = document.querySelectorAll('.brand input');
    let activeBrands = params.get("brands") || [];
    if(activeBrands){
        //activeBrands = activeBrands.split()
        for (let i = 0; i < activeBrands.length; i++) {
            brandChecks[activeBrands[i]].checked = true
        }
    }


    console.log("UrlSearchParams: " + params)
    console.log("UrlSearchParams length: " + params.size);
    console.log("Search text: " + searchText);
    console.log("Active colors: " + activeColors);
    console.log("Active brands: " + activeBrands)

    let visibleCount = 0;

    //fetches product data and compares with search request
    const data = await getProductData();
    data.forEach(({id, name, price, colors, brand, sizes, description, variants}) => {
        //check for matching request with item/product data
        let isVisible = true;
        if (params.size > 1) {
            //acounts for searchtext == ""
            let matchesText = true;
            if (searchText.length != 0) {
                matchesText = format(name).includes(format(searchText));
            }
            const matchesPrice = price >= parseFloat(min) && price <= parseFloat(max);
            let matchesColor = false;
            if (activeColors.length === 0) {
                matchesColor = true
            } else {
                for(let i = 0; i < colors.length; i++) {
                    if (!matchesColor && activeColors.includes(colors[i])) {
                        matchesColor = true;
                    }
                }
            }
            const matchesBrand = activeBrands.length === 0 || activeBrands.includes(brand);

            isVisible = matchesText && matchesPrice && matchesColor && matchesBrand; 
        } else {
            if (searchText.length != 0) {
                isVisible = format(name).includes(format(searchText));
            }
        }
        
        

        
        //if matches create a new html element by template
        if (isVisible) {
            visibleCount++;

            let mainHTML = `
                <div class="item" id="${id}" data-href="${id}.html">
                    <div class="href">
                        <div style="display: flex; align-items:center; justify-content:center; aspect-ratio: 1/1; overflow: hidden;">
                            <img class="item-img" src="imgs/shoes/${id}/${id}_1_1.png">
                        </div>
                        <p class="name">${name}</p>
                        <p class="price">${price}$</p>
                    </div>`;

            let colorways = `<div class="color-ways">`;
            for (let i = 0; i < variants; i++) {
                colorways += `
                <div class="color-way" data-color="${i}">
                    <img src="imgs/shoes/${id}/${id}_${i+1}_1.png">
                </div>`;   
            }
            colorways += "</div> </div>";

            mainHTML += colorways;

            const wrapper = document.createElement("div");
            wrapper.innerHTML = mainHTML.trim();
            let itemHtmlElement = wrapper.firstElementChild;

            itemContainer.appendChild(itemHtmlElement);



            
            
            //sets up the item
            itemHtmlElement = document.getElementById(id);


            const colorwaySelectors = itemHtmlElement.querySelectorAll('.color-way');
            colorwaySelectors.forEach(colorwaySelector => colorwaySelector.addEventListener('click', (event) => changeColorway(parseInt(colorwaySelector.dataset.color), id)));

            if (activeColors.length === 0) {
                changeColorway(0, id);
            } else {
                for (let i = 0; i < variants; i++) {
                    if (activeColors.includes(colors[i]) && !colorways.includes('active')) { 
                        changeColorway(i, id)
                    }
                }
            }
            itemHtmlElement.querySelector('.href').addEventListener('click', (event) => linkToItem(id));
        }
    });

    // update item count
    document.getElementById('items-found').textContent = `${visibleCount} item(s) found for "${searchbar.value}"`;

    applySort();
    
}

function search() {
    let searchText = "" + searchbar.value;
    let href = `search.html?searchText=${searchText}`

    if(document.URL.includes("search")){ //if user is on search.html additional filters get passed
        let minValue = document.getElementById('minNum').value;
        let maxValue = document.getElementById('maxNum').value;
        href += `&min=${minValue}&max=${maxValue}`;

        let colorChecks = document.querySelectorAll('.color input');
        let colors = []
        for (let i = 0; i < colorChecks.length; i++) {
            if(colorChecks[i].checked){
                colors.push(i)
            }
        }
        if (!(colors.length === 0)) {
            href += "&colors="
            for (let i = 0; i < colors.length; i++) {
                href += colors[i].toString()
            }
        }

        let brandChecks = document.querySelectorAll('.brand input');
        let brands = []
        for (let i = 0; i < brandChecks.length; i++) {
            if(brandChecks[i].checked){
                brands.push(i)
            }
        }
        if (!(brands.length === 0)) {
            href += "&brands="
            for (let i = 0; i < brands.length; i++) {
                href += brands[i].toString()
            }
        }
    }

    window.location.href = href
}

function changeColorway(color, id) {
    const item = document.getElementById(id);
    let colors = item.querySelectorAll('.color-way');
    let ItemImg = item.querySelector('.item-img');
    for (let i = 0; i < colors.length; i++) {
        colors[i].classList.remove('active');
    }
    colors[color].classList.add('active');
    ItemImg.src = replaceCharAt(ItemImg.src, `${color + 1}`,ItemImg.src.length - 7);
}

function linkToItem(id) {
    let item = document.getElementById(id)

    let color = item.querySelector('.color-way.active').dataset.color;
    
    window.location.href = "item.html" + "?id=" + id + '&color=' + color;
}