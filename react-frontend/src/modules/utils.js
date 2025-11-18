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

export class MissingPropError extends Error {
    constructor(message) {
        super(message)
        this.name = "MissingPropError"
    }
}

export class InvalidPropTypeError extends Error {
    constructor(message) {
        super(message)
        this.name = "InvalidPropTypeError"
    }
}