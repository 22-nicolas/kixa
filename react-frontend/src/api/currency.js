import { getBaseApiUrl } from "../modules/utils";

const API_BASE_URL = getBaseApiUrl();

export async function getConversionRates() {
    const response = await fetch(`${API_BASE_URL}/currency/conversion-rates`);
    const data = await response.json();
    const conversionRates = data.rates;
    return conversionRates;
}

export async function getPreferedCurrency() {
    const response = await fetch(`${API_BASE_URL}/currency/user-preference`);

    const data = await response.json();
    const preferedCurrency = data.currency;
    
    return preferedCurrency;
}