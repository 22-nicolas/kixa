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