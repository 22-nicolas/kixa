import { getProductById } from "../modules/api";
import { CartContext } from "../App";
import { useCart } from "./CartProvider";

export function useAddToCart() {
    const {updateCart} = useCart(CartContext)

    return async (id, color, size) => {
        if (!size) {
            alert('Please select a size.')
            return
        }

        const {name, price} = await getProductById(id)
        
        
        updateCart(prevCart => {
            const index = prevCart.findIndex(item => item.id === id && item.size === size && item.color === color);

            // If it exists, increase quantity
            if (index !== -1) {
                const updated = [...prevCart]
                updated[index] = {
                    ...updated[index],
                    quantity: updated[index].quantity + 1
                }
                return updated
            }

            //Else return with quantity 1
            return[
                ...prevCart,
                {id, name, price, color, size, quantity: 1}
            ]
        });
    }
}

function getCartItems() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    return cartItems;
}