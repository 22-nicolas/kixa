import { getBaseApiUrl } from "../modules/utils";
import { SupportedCurrencies } from "../customHooks/CurrencyProvider";

const API_BASE_URL = getBaseApiUrl();

export async function getConversionRates() {
    const response = await fetch(`${API_BASE_URL}/currency/conversion-rates`);
    const data = await response.json();
    const conversionRates = data.rates;
    return conversionRates;
}

export async function getPreferedCurrency() {
    const response = await fetch(`${API_BASE_URL}/currency/user-preference`);
    if (!response.ok) return "USD"; // Fallback to USD if the request fails

    const data = await response.json();
    const preferedCurrency = data.currency;

    if (!SupportedCurrencies.includes(preferedCurrency)) return "USD"; // Fallback to USD if the currency is not supported
    
    return preferedCurrency;
}