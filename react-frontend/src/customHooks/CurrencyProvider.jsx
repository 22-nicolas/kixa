import { createContext, useEffect, useState } from "react";
import { getPreferedCurrency } from "../api/currency";

export const CurrencyContext = createContext();

export const SupportedCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD"];

export default function CurrencyProvier({ children }) {
    const [currency, setCurrency] = useState("USD");

    useEffect(() => {
        fetchPreferedCurrency()
    }, [])

    async function fetchPreferedCurrency() {
        const preferedCurrency = await getPreferedCurrency()
        setCurrency(preferedCurrency)
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    )
}