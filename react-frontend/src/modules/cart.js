import { getProductById } from "./api";

export async function addToCart(id, color, size) {
    if (!size) {
        alert('Please select a size.')
        return
    }

    let cartItems = getCartItems();

    const {name, price} = await getProductById(id)

    const existingItem = cartItems.find(item => item.id == id && item.size == size && item.color == color);

    if (existingItem) {
        // If it exists, increase quantity
        existingItem.quantity += 1;
    } else {
        // Otherwise, add new item to cart
        cartItems.push({
            id,
            name,
            price,
            color,
            size,
            quantity: 1
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function getCartItems() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    return cartItems;
}