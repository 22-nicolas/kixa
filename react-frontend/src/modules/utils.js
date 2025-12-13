import { getProductData } from "../api/productData";

export const shoeAssetsPath = "shoes"

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

export function isImage(src) {
    return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(src);
};

export function isVideo(src) {
    return /\.(mp4|webm|ogg|mov)$/i.test(src);
};

export async function getProductIdFromSrc(src) {
    const products = await getProductData()
    for (const { id } of products) {
        if (src.includes(id)) {
            return id
        }
    }
    return null
}

export function getBaseApiUrl() {
    let API_BASE_URL;

    if (window.location.hostname === "localhost") {
        API_BASE_URL = "http://localhost:3000/api"
    } else {
        API_BASE_URL = "https://kixa-production.up.railway.app/api"
    }
    
    return API_BASE_URL
}