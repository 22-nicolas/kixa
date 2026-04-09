import { getProductStock } from "../api/productData";

export const stockStates = {
    inStock: 0,
    notEnoughStock: 1,
    outOfStock: 2
}

export async function checkStockStatus(id, variant, size, stock) {
    const productStock = await getProductStock(id, variant, size)

    let stockState
    if (!productStock || productStock.stock === 0) {
        stockState = stockStates.outOfStock
    } else if (productStock?.stock >= stock) {
        stockState = stockStates.inStock
    } else if (productStock && productStock.stock < stock) {
        stockState = stockStates.notEnoughStock
    }

    return {stockState, productStock: productStock?.stock}
}