import { supportedCountries } from "../../../packages/shared";
import { getBaseApiUrl } from "../modules/utils";
import { apiFetch } from "./apiFetch";

const API_BASE_URL = getBaseApiUrl();



export async function getCountriesData() {
    const response = await apiFetch(`${API_BASE_URL}/countries/`);
    const countriesData = await response.json();
    return countriesData;
}

export async function getUserLocationData() {
    const response = await apiFetch(`${API_BASE_URL}/countries/locate`);
    const locationData = await response.json();
    return locationData;
}

export async function getUserCountryName() {
    const locationData = await getUserLocationData();
    const countryName = locationData.countryName;
    console.log(supportedCountries)
    if (supportedCountries.includes(locationData.countryCode)) return countryName

    const supportedCountriesData = await getCountriesData();
    return supportedCountriesData[0].name //default to first supported country if user country is not supported
}

export async function getUserPhonePrefix() {
    const locationData = await getUserLocationData();
    const phonePrefix = locationData.phonePrefix;
    return phonePrefix;
}