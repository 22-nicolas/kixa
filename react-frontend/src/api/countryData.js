import { getBaseApiUrl } from "../modules/utils";

const API_BASE_URL = getBaseApiUrl();



export async function getCountryData(country) {
    const response = await fetch(`${API_BASE_URL}/country/${country}`);
    const countryData = await response.json();
    return countryData;
}