import { createContext, useEffect, useState } from "react";
import { getConversionRates, getPreferedCurrency } from "../api/currency";
import { supportedCurrencies } from "../../../packages/shared/supportedCurrencies";

export const CurrencyContext = createContext();

export default function CurrencyProvier({ children }) {
    const [currency, setCurrency] = useState("USD");
    const [conversionRates, setConversionRates] = useState()

    useEffect(() => {
        fetchPreferedCurrency()
        fetchConversionRates()
    }, [])

    useEffect(() => {
        fetchPreferedCurrency()
    }, [supportedCurrencies])

    async function fetchPreferedCurrency() {
        if (!supportedCurrencies || supportedCurrencies.length === 0) return
        const preferedCurrency = await getPreferedCurrency()

        // Fallback to USD if the request fails
        if (!preferedCurrency) {
            setCurrency("USD")
            return
        }

        // Fallback to USD if the currency is not supported
        if (!supportedCurrencies.includes(preferedCurrency)) {
            setCurrency("USD")
            return
        }

        setCurrency(preferedCurrency)
    }

    async function fetchConversionRates() {
        const rates = await getConversionRates()
        setConversionRates(rates)
    }

    async function fetchSupportedCurrencies() {
        const countriesData = await getCountriesData() 
        const currencyCodes = countriesData?.map(data => data.currency.code)
        const uniqueCurrencyCodes = [...new Set(currencyCodes)];
        setSupportedCurrencies(uniqueCurrencyCodes)
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, conversionRates, supportedCurrencies }}>
            {children}
        </CurrencyContext.Provider>
    )
}