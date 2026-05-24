import { getBaseApiUrl } from "../modules/utils";
import { apiFetch } from "./apiFetch";
import { getUserLocationData } from "./countriesData";

const API_BASE_URL = getBaseApiUrl();

export async function getConversionRates() {
    const response = await apiFetch(`${API_BASE_URL}/currency/conversion-rates`);
    const conversionRates = await response.json();
    return conversionRates;
}

export async function getPreferedCurrency() {
    const locationData = await getUserLocationData();
    const preferedCurrency = locationData.currency;
    
    return preferedCurrency;
}