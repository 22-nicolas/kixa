export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function format(str) {
    return str.replace(" ", "").toLowerCase();
}

export function matchArr(arr1, arr2) {
    if(arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

export function isDescandentOf(parentElement, searchElement) {
    let currentElement = parentElement;
    while (currentElement) {
        if (currentElement == searchElement) {
            return true
        } else {
            currentElement = currentElement.parentElement;
        }
    }
}

export function replaceCharAt(str, char, index) {
    return str.substring(0, index) + char + str.substring(index + 1);
}

export function capitalize(str) {
    return str.split(" ").map(word => {
        if (word.length > 0) {
            return word[0].toUpperCase() + word.slice(1);
        } else {
            return "";
        }
    }).join(" ");
}

export async function fetchProductData() {
    try {
        const response = await fetch("products_data.json");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error fetching JSON:", error);
    }
}