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
}

export async function createOrder(cartItems, addressForm) {
    const response = await apiFetch(`${API_BASE_URL}/checkout/create-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartItems, addressForm })
    });
    if (response.ok) return {ok: true, orderId: (await response.json()).orderId}

    if (response.status === 500) {
        return {error: "Internal Server error"}
    }
}

export async function getShippingCost(country_code) {
    const response = await apiFetch(`${API_BASE_URL}/checkout/get-shipping-cost/${country_code}`);
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    return null;
}