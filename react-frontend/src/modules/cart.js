import { getProductById } from "./api";

export async function addToCart(id) {
    let cartItems = getCartItems();

    const {name, price} = await getProductById(id)


    const existingItem = cartItems.find(item => item.id == id );

    if (existingItem) {
        // If it exists, increase quantity
        existingItem.quantity += 1;
    } else {
        // Otherwise, add new item to cart
        cartItems.push({
            id,
            name,
            price,
            quantity: 1
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log(getCartItems())
}

function getCartItems() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    return cartItems;
}