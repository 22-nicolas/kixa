import { getBaseApiUrl } from "../modules/utils";

const API_BASE_URL = getBaseApiUrl();



export async function getCountriesData() {
    const response = await fetch(`${API_BASE_URL}/countries/`);
    const countriesData = await response.json();
    return countriesData;
}