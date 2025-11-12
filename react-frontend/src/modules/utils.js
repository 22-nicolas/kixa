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