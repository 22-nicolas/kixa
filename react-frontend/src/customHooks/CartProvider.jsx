import { useState, createContext, useContext } from "react"

const CartContext = createContext()

export default function CartProvider({ children }) {
    const key = "cartItems"
    //localStorage.clear()
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

    return (
        <CartContext.Provider value={{ cart, updateCart }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}