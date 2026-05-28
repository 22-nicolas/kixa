import { getBaseApiUrl } from "../modules/utils";
import { apiFetch } from "./apiFetch";

const API_BASE_URL = getBaseApiUrl();

export async function validateAddressForm(formData) {
    const response = await apiFetch(`${API_BASE_URL}/checkout/validate-address-form`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    if (response.ok) return {ok: true}

    if (response.status === 500) {
        return {error: "Internal Server error"}
    }
    const data = await response.json();
    return data;
}