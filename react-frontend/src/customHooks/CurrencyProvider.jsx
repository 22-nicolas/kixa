import { createContext, useContext, useEffect, useState } from "react";
import { getConversionRates, getPreferedCurrency } from "../api/currency";
import { supportedCurrencies } from "../../../packages/shared/index";
import { getCookie, notNil } from "../modules/utils"

const CurrencyContext = createContext();

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
        const cookieCurrency = getCookie("currency")
        if (notNil(cookieCurrency)) {
            setCurrency(cookieCurrency)
            return
        }

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
        console.log(rates)
        setConversionRates(rates)
    }


    function changeCurrency(newCurrency) {
        setCurrency(newCurrency)
        document.cookie = `currency=${newCurrency}`
    }

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, conversionRates, supportedCurrencies }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    return useContext(CurrencyContext);
}