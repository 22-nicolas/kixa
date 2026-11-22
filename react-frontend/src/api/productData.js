import { getBaseApiUrl, notNil } from "../modules/utils";
import { apiFetch } from "./apiFetch";

const API_BASE_URL = getBaseApiUrl();

export async function getProductData() {
    try {
        const response = await apiFetch(`${API_BASE_URL}/products`);
        if (!response.ok) return [];
        const products = await response.json();
        return Array.isArray(products) ? products : [];
    } catch (err) {
        console.warn("Failed to fetch product data:", err.message);
        return [];
    }
}

export async function getProductById(id) {
    if (!id) return null;
    try {
        const response = await apiFetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) return null;
        const product = await response.json();
        return (product && product.id) ? product : null;
    } catch (err) {
        console.warn(`Failed to fetch product with id ${id}:`, err.message);
        return null;
    }
}

export async function createProductData(product) {
    const response = await apiFetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
    const result = await response.json();
    return result;
}

export async function deleteProductData(id) {
    const response = await apiFetch(`${API_BASE_URL}/products/delete/${id}`);
    return response;
}

export async function getProductStock(productId, variant, size) {
    if (!productId) return null;
    try {
        let response;
        if (notNil(variant) && notNil(size)) {
            response = await apiFetch(`${API_BASE_URL}/products/stock`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id: productId, variant: variant, size: size})
            });
        } else {
            response = await apiFetch(`${API_BASE_URL}/products/stock/${productId}`);
        }

        if (!response.ok) return null;
        const stock = await response.json();
        return stock;
    } catch (err) {
        console.warn(`Failed to fetch stock for product ${productId}:`, err.message);
        return null;
    }
}
