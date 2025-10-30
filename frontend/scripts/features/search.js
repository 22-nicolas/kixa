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

    slider.minRange.addEventListener('input', updateRange);
    slider.maxRange.addEventListener('input', updateRange);

    slider.minNum.addEventListener('input', updateSlider);
    slider.maxNum.addEventListener('input', updateSlider);

    window.addEventListener('resize', updateRange);

    updateRange();

    let applyButton = document.querySelector('.apply-button');
    applyButton.addEventListener('click', () => search())
}

function getSlider() {
    const slider = {
        minRange: document.getElementById('min'),
        maxRange: document.getElementById('max'),
        minNum: document.getElementById('minNum'),
        maxNum: document.getElementById('maxNum'),
        range: document.getElementById('range'),
    }

    return slider;
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

function updateSlider(minValue, maxValue) {
    const slider = getSlider();

    if (!minValue || !maxValue) {
        minValue = slider.minNum.value;
        maxValue = slider.maxValue.value;
    }

    slider.minRange.value = minValue;
    slider.maxRange.value = maxValue;

    updateRange();
}

export function initChecks() {
    initColorSpans()

    let colorChecks = document.querySelectorAll('.color input');
    bindClickToSearch(colorChecks)

    let brandChecks = document.querySelectorAll('.brand input');
    bindClickToSearch(brandChecks)
}

function bindClickToSearch(checks) {
    for (let i = 0; i < checks.length; i++) {
        checks[i].addEventListener('click', () => search());
    }
}

function initColorSpans() {
    const spans = document.querySelectorAll('.color span');
    for (let i = 0; i < spans.length; i++) {
        spans[i].style.backgroundColor = spans[i].parentElement.htmlFor;
    }

    return spans
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
        
        sortFilters(params);

        applySort();
    }));
}

function sortFilters(params) {
    //sort params in alphabetical order
    const sortDropdown = document.querySelector('.sort-dropdown');
    const sorted = Array.from(params).sort((a, b) => {
        return a.textContent.localeCompare(b.textContent);
    });
    sortDropdown.innerHTML = "";
    sorted.forEach(param => sortDropdown.appendChild(param));
}

async function applySort() {
    const itemContainer = document.querySelector('.item-container');
    const itemsData = await getProductData();
    const items = Array.from(itemContainer.querySelectorAll('.item'));
    const params = document.getElementById('sort-params').textContent.trim();
    const searchTerm = document.getElementById('searchbar').value.trim().toLowerCase();
    const sortBy = getSortFuncs();

    function sortItems(compareFn) {
        const sorted = [...itemsData].sort(compareFn);
        //clear itemContainer
        itemContainer.innerHTML = "";
        
        //append sorted list of items
        sorted.forEach(itemsData => {
            const {id} = itemsData;
            items.forEach(item => {
                if (item.id == id) {
                    itemContainer.appendChild(item);
                }
            });
        });
    }

    if (params === "best match") {
        //Fallback: alphabetical order
        if (searchTerm === "" || !searchTerm) {
            sortItems((a, b) => sortBy.alphabeticalOrder(a, b));
        } else {
            sortItems((a, b) => sortBy.bestMatch(a, b));
        }
    }

    if (params === "price (lowest to highest)") {
        sortItems((a, b) => sortBy.lowestToHighest(a, b));
    }

    if (params === "price (highest to lowest)") {
        sortItems((a, b) => sortBy.highestToLowest(a, b));
    }
}

function getSortFuncs() {
    return {
        alphabeticalOrder: function (a, b) {
            const nameA = (a.name).toLowerCase();
            const nameB = (b.name).toLowerCase();
            return nameA.localeCompare(nameB);
        },
        bestMatch: function (a, b) {
            let searchTerm = document.getElementById('searchbar').value.trim().toLowerCase();
            const nameA = (a.name).toLowerCase();
            const nameB = (b.name).toLowerCase();

            const indexA = nameA.indexOf(searchTerm);
            const indexB = nameB.indexOf(searchTerm);

            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;

            return indexA - indexB;
        },
        lowestToHighest: function (a, b) {
            return parseFloat(a.price) - parseFloat(b.price);
        },
        highestToLowest: function (a, b) {
            return parseFloat(b.price) - parseFloat(a.price);
        }
    }
}

export async function createItems(ignoreParams) {
    //gets search params from the url
    let rawParams = new URLSearchParams(window.location.search);
    let itemContainer = document.querySelector(".item-container");

    //keeps searchbar text content and filters consistent with the last page
    let {params, searchbar} = keepSearchFilters(rawParams); 
    let {searchText, minValue, maxValue, activeColors} = params;
  
    let visibleCount = 0;

    //fetches product data and compares with search request
    const data = await getProductData();
    data.forEach((itemData) => {
        let isVisible = matchWithParams(itemData, params, ignoreParams);
        let {id, name, price, colors, brand, sizes, description, variants} = itemData;
        
        //if matches create a new html element by template
        if (isVisible) {
            visibleCount++;

            let itemHtmlElement = createItemElement(itemData);
            addItemListeners(itemHtmlElement, itemData);

            itemContainer.appendChild(itemHtmlElement);
        }
    });

    // update item count
    document.getElementById('items-found').textContent = `${visibleCount} item(s) found for "${searchbar.value}"`;

    //if no results found display no results and all avaible items
    if (visibleCount == 0) {
        itemContainer.classList.remove("item-container");
        itemContainer.classList.add("no-results-item-container");
        
        itemContainer.innerHTML = 
        `
        <div class="no-results">
            <p>No results found.</p>
        </div>
        <div class="item-container"></div>
        `;
        
        itemContainer = document.querySelector("item-container");
        createItems(true);
    }

    applySort();
    
}

function keepSearchFilters(rawParams) {
    const searchbar = document.getElementById('searchbar');
    let searchText = rawParams.get("searchText");
    searchbar.value = searchText;
    
    const slider = getSlider();
    let minValue = rawParams.get("min");
    let maxValue = rawParams.get("max");
    if(rawParams.get("min")) {
        updateSlider(minValue, maxValue);
    }
    
    // get active color and brand IDs (as integers to match dataset)
    let colorChecks = document.querySelectorAll('.color input');
    let activeColors = rawParams.get("colors") || [];
    if(activeColors){
        for (let i = 0; i < activeColors.length; i++) {
            colorChecks[activeColors[i]].checked = true
        }
    }

    let brandChecks = document.querySelectorAll('.brand input');
    let activeBrands = rawParams.get("brands") || [];
    if(activeBrands){
        //activeBrands = activeBrands.split()
        for (let i = 0; i < activeBrands.length; i++) {
            brandChecks[activeBrands[i]].checked = true
        }
    }
    let params = {searchText: searchText, minValue: minValue, maxValue: maxValue, activeColors: activeColors, activeBrands: activeBrands}
    return {params, searchbar, slider, colorChecks, brandChecks}
}

function matchWithParams(itemData, params, ignoreParams) {
    let {id, name, price, colors, brand} = itemData
    let {searchText, minValue, maxValue, activeColors, activeBrands} = params;

    if (ignoreParams) {
        return true
    }

    if (minValue) {
        //acounts for searchtext == ""
        let matchesText = true;
        if (searchText.length != 0) {
            matchesText = format(name).includes(format(searchText));
        }
        const matchesPrice = price >= parseFloat(minValue) && price <= parseFloat(maxValue);
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
        //console.log({matchesText: matchesText, matchesPrice: matchesPrice, matchesColor: matchesColor, matchesBrand: matchesBrand})
        return matchesText && matchesPrice && matchesColor && matchesBrand; 
    }

    if (searchText && searchText.length != 0) {
        return format(name).includes(format(searchText));
    }

    return true
}

function createItemElement(itemData) {
    let {id, name, price, colors, brand, sizes, description, variants} = itemData;
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

    let params = new URLSearchParams(window.location.search);
    let activeColors = params.get("colors")
    if (!activeColors) {
        return itemHtmlElement
    }
    
    if (activeColors.length === 0) {
        changeColorway(0, itemHtmlElement);
    } else {
        for (let i = 0; i < variants; i++) {
            if (activeColors.includes(colors[i]) && !colorways.includes('active')) { 
                changeColorway(i, itemHtmlElement);
            }
        }
    }

    return itemHtmlElement;
}

function addItemListeners(itemHtmlElement, itemData) {
    let {id} = itemData;
    const colorwaySelectors = itemHtmlElement.querySelectorAll('.color-way');
    colorwaySelectors.forEach(colorwaySelector => colorwaySelector.addEventListener('click', () => changeColorway(parseInt(colorwaySelector.dataset.color), id)));

    itemHtmlElement.querySelector('.href').addEventListener('click', () => linkToItem(id));
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

function changeColorway(color, itemHtmlElement) {
    let colors = itemHtmlElement.querySelectorAll('.color-way');
    let ItemImg = itemHtmlElement.querySelector('.item-img');
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
