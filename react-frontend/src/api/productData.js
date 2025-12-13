import { getBaseApiUrl } from "../modules/utils";

const API_BASE_URL = getBaseApiUrl();

export async function getProductData() {
    const response = await fetch(`${API_BASE_URL}/products`);
    const products = await response.json();
    return products;
}

export async function  getProductById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    const product = await response.json();
    return product;
}

export async function  createProductData(product) {
    //const product = {id, name, price, colors, brand, sizes, description, variants, type, imgs_per_colorway}
    const response = await fetch(`${API_BASE_URL}/products`, {
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
    const response = await fetch(`${API_BASE_URL}/products/delete/${id}`);
    return response;
}