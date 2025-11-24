import { getProductData } from "./api";

export const shoeAssetsPath = "public/shoes"

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