import { createContext, useState } from "react";

export const CurrencyContext = createContext();

export default function CurrencyProvier({ children }) {
    const [currency, setCurrency] = useState("USD");

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    )
}