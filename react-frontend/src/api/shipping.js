import { getBaseApiUrl } from "../modules/utils";
import { apiFetch } from "./apiFetch";

const API_BASE_URL = getBaseApiUrl();

export async function getShippingCost(country_code) {
    const response = await apiFetch(`${API_BASE_URL}/shipping/${country_code}`);
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    return null;
}