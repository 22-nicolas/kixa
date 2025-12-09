import { useState, createContext, useContext } from "react"
import { getProductById } from "../modules/api";

const CartContext = createContext()

export default function CartProvider({ children }) {
    const key = "cartItems"
    
    const stored = localStorage.getItem(key)
    const [cart, setCart] = useState(() => {
        return stored ? JSON.parse(stored) : [];
    })

    const updateCart = (updater) => {
        setCart(prev => {
            const newVal = typeof updater === "function" ? updater(prev) : updater;
            localStorage.setItem(key, JSON.stringify(newVal));
            return newVal;
        });
    }

    const addToCart = async (id, color, size) => {    
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

    const removeFromCart = (id, color, size) => {
        updateCart(prevCart => {
            const index = prevCart.findIndex(item => item.id === id && item.size === size && item.color === color);

            if (index === -1) {
                console.warn(`Item not found while triying to remove from cart. id: ${id}, color: ${color}, size ${size}`);
                return prevCart
            }
            
            const updated = [...prevCart]

            //If quantity is greater than 1, decrease it
            if (updated[index].quantity > 1) {
                updated[index] = {
                    ...updated[index],
                    quantity: updated[index].quantity - 1
                };
                return updated;
            }

            // If quantity becomes 0, remove the item
            updated.splice(index, 1);
            return updated;
        });
    }

    const getQuantity = () => {
        let quantity = 0
        cart.forEach(item => {
            quantity += item.quantity
        });
        return quantity
    }

    return (
        <CartContext.Provider value={{ cart, updateCart, addToCart, removeFromCart, getQuantity }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}