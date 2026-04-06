import { createContext, useEffect, useState } from "react";
import { getConversionRates, getPreferedCurrency } from "../api/currency";

export const CurrencyContext = createContext();

export const SupportedCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD", "RON"];

export default function CurrencyProvier({ children }) {
    const [currency, setCurrency] = useState("USD");
    const [conversionRates, setConversionRates] = useState()

    useEffect(() => {
        fetchPreferedCurrency()
    }, [])

    useEffect(() => { 
        fetchConversionRates()
    }, [])

    async function fetchPreferedCurrency() {
        const preferedCurrency = await getPreferedCurrency()
        setCurrency(preferedCurrency)
    }

    async function fetchConversionRates() {
        const rates = await getConversionRates()
        setConversionRates(rates)
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, conversionRates }}>
            {children}
        </CurrencyContext.Provider>
    )
}