export async function getRequiredFields() {
    const response = await fetch("http://localhost:3000/api/register/required_fields");
    const required_fields = await response.json();
    return required_fields;
}

export async function getProductData() {
    const response = await fetch("http://localhost:3000/api/products");
    const products = await response.json();
    return products;
}

export async function  getProductById(id) {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    const product = await response.json();
    console.log(product)
    return product;
}

export async function  createProductData(product) {
    //const product = {id, name, price, colors, brand, sizes, description, variants, type, imgs_per_colorway}
    const response = await fetch("http://localhost:3000/api/products", {
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
    const response = await fetch(`http://localhost:3000/api/products/delete/${id}`);
    return response;
}