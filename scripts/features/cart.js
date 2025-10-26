import { capitalize } from "../utils/utils.js";

export function initCart() {
    updateCartQuantityDisplay();

    if (window.location.href.includes("cart")) {
        configureCartPage();
    }
}

export function addToCart(name, color) {
    let cartItems = getCartItems();

    let size = document.querySelector('.size.active');
    if (!size) {
        alert('Please select a size.');
        return;
    } else {
        size = size.textContent;
    }

    let price = document.querySelector('.price').textContent;
    price = price.replace("$", "");


    const existingItem = cartItems.find(item => item.name == name && item.size == size && item.color == color);

    if (existingItem) {
        // If it exists, increase quantity
        existingItem.quantity += 1;
    } else {
        // Otherwise, add new item to cart
        cartItems.push({
            name,
            price,
            color,
            size,
            quantity: 1
        });
    }

    let cartQuantity = 0;
    for (let i = 0; i < cartItems.length; i++) {
        cartQuantity += cartItems[i].quantity;
    }
    let cartQuantityDisplay = document.querySelector('.right-header a p');
    cartQuantityDisplay.textContent = cartQuantity.toString();

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function getCartItems() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    return cartItems;
}

function configureCartPage() {
    let cartItems = getCartItems();
    const subtotal = document.getElementById('subtotal');
    const itemCostP = document.getElementById('items-cost');
    let itemCost = 0;
    cartItems.forEach(item => {
        const template = document.getElementById('item');
        const clone = template.cloneNode(true); // true = deep clone

        itemCost += parseInt(item.quantity) * parseInt(item.price);
        itemCostP.textContent = `US $${itemCost}`;

        subtotal.textContent = `US $${itemCost + 10}`;

        clone.removeAttribute('id'); // important: no duplicate IDs
        clone.style.display = 'block'; // or whatever your item layout needs

        let color = parseInt(item.color);

        // Set the content
        clone.querySelector('.img-container img').src = `imgs/shoes/${item.name}/${item.name}_${color+1}_1.png`;
        clone.querySelector('.item-info a').textContent = capitalize(item.name.replaceAll("_", " "));
        clone.querySelector('.item-info a').href = `item.html?id=${item.name}&color=${color}`;
        clone.querySelector('.color-size').textContent = `Variant ${color+1}, Size ${item.size}`;
        clone.querySelector('.item-qty').textContent = `Qty ${item.quantity}`;
        clone.querySelector('.price').textContent = `US $${(item.price * item.quantity).toFixed(2)}`;

        //Link remove btn
        clone.querySelector('.remove-btn').addEventListener('click', () => {
            for (let i = 0; i < cartItems.length; i++) {
                if (cartItems[i] == item) {
                    if (item.quantity > 1) {
                        item.quantity--;
                        clone.querySelector('.item-qty').textContent = `Qty ${item.quantity}`;
                        clone.querySelector('.price').textContent = `US $${(item.price * item.quantity).toFixed(2)}`;
                        itemCost = 0;
                    } else {
                        cartItems.splice(i, 1);
                        clone.parentNode.removeChild(clone)
                        itemCost = 0;
                    }
                }
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartQuantityDisplay();
            
            cartItems.forEach(item  => {
                itemCost += parseInt(item.quantity) * parseInt(item.price);
            });

            itemCostP.textContent = `US $${itemCost}`;

            subtotal.textContent = `US $${itemCost + 10}`;
        });

        // Append to the cart container
        document.querySelector('.cart-list').appendChild(clone);
    });
}

function updateCartQuantityDisplay() {
    let cartItems = getCartItems();
    let cartQuantity = 0;
    for (let i = 0; i < cartItems.length; i++) {
        cartQuantity += cartItems[i].quantity;
    }
    let cartQuantityDisplay = document.querySelector('.right-header a p');
    if (cartQuantityDisplay) {
        cartQuantityDisplay.textContent = cartQuantity.toString();
    }

    let items = document.getElementById('items')

    if(items){
        items.textContent = `Items (${cartQuantity})`;
    }
}