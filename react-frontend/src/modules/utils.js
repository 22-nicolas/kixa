import { getProductData } from "../api/productData";

export const shoeAssetsPath = "shoes"

export const supportedCountries = ["france", "germany", "italy", "poland", "portugal", "spain", "united kingdom", "us"]

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

const API_URL_PRODUCTION = import.meta.env.VITE_API_URL_PRODUCTION;
const API_URL_DEVELOPMENT = import.meta.env.VITE_API_URL_DEVELOPMENT;
export function getBaseApiUrl() {
    let API_BASE_URL;

    if (window.location.hostname === "localhost") {
        API_BASE_URL = API_URL_DEVELOPMENT
    } else {
        API_BASE_URL = API_URL_PRODUCTION
    }
    
    return API_BASE_URL
}