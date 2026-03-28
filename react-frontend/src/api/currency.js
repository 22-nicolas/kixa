import { getBaseApiUrl } from "../modules/utils";

const API_BASE_URL = getBaseApiUrl();



export async function getConversionRates() {
    const response = await fetch(`${API_BASE_URL}/conversion-rates`);
    const data = await response.json();
    const conversionRates = data.rates;
    return conversionRates;
}