import { getBaseApiUrl, notNil } from "../modules/utils";
import { apiFetch } from "./apiFetch";

const API_BASE_URL = getBaseApiUrl();

export async function getProductData() {
    const response = await apiFetch(`${API_BASE_URL}/products`);
    const products = await response.json();
    return products;
}

export async function  getProductById(id) {
    const response = await apiFetch(`${API_BASE_URL}/products/${id}`);
    const product = await response.json();
    return product;
}

export async function  createProductData(product) {
    //const product = {id, name, price, colors, brand, sizes, description, variants, type, imgs_per_colorway}
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
    let stock
    if (notNil(variant) && notNil(size)) {
        const response = await apiFetch(`${API_BASE_URL}/products/stock`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: productId, variant: variant, size: size})
        });

        stock = await response.json();
    } else {
        const response = await apiFetch(`${API_BASE_URL}/products/stock/${productId}`);
        stock = await response.json();
    }

    return stock;
}