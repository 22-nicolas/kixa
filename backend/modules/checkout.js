import { getConversionRates } from "../routes/currency.js";
import { getOrderById, updateOrderStatus, createOrder, addOrderAddress } from "../sql/orders.js";
import { getProductById, getProductStock, reduceStock } from "../sql/products.js";
import { sendConfirmationEmail } from "./nodemail.js";

export async function getPayPalAccessToken() {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    const data = await response.json();
    return data.access_token;
}

export async function validateCart(items, currency, buildItems = false) {
    const conversionRates = await getConversionRates();

    let lineItems = []
    let orderItems = []

    if (!Array.isArray(items)) throw new Error("Invalid items");

    if(items.length === 0) throw new Error("Cart is empty");

    for (const item of items) {
        if (item.quantity <= 0) throw new Error("Invalid quantity");
        
        const stockData = await getProductStock(item.id, item.color, item.size);

        if (!stockData) throw new Error("Product not found");
        
        //check stock
        if (stockData.stock < item.quantity) {
            throw new Error(`${item.name} - Out of stock or quantity exceeded stock`);
        }


        if (!buildItems) return;

        let price

        if (currency && conversionRates && stockData) {
            price = stockData.price;
            price = convertPrice(stockData.price, currency, conversionRates)
        } else {
            throw new Error("Currency data is not available");
        }


        lineItems.push({
            price_data: {
                currency: currency?.toLowerCase() || "eur",
                product_data: {
                    name: item.name,
                },
                // Stripe expects unit_amount in cents (integer)
                unit_amount: Math.round(Number(price) * 100),
            },
            quantity: item.quantity,
        });
        
        let orderItem = {...stockData, quantity: item.quantity, id: item.id}
        delete orderItem.stock;
        delete orderItem.product_id;
        orderItems.push(orderItem);
    }

    return {lineItems, orderItems};
}

export function convertPrice(price, currency, conversionRates) {
    const usdPrice = Number(price) / conversionRates["EUR"]
    const convertedPrice = Number((conversionRates[currency] * usdPrice).toFixed(2))

    return convertedPrice
}

export async function handleCompleteCheckout(sessionData) {
    let id;
    let email;
    let name;
    let address;

    id = sessionData.metadata.orderId;
    email = sessionData.customer_details.email;
    name = sessionData.customer_details.name?.split(" ")[0];
    address = sessionData.collected_information.shipping_details;

    await addOrderAddress(id, address);
    await updateOrderStatus(id, "payed");

    const orderInfo = await getOrderById(id);
    const items = orderInfo.items;

    // Reduce stock for each item
    for (const item of items) {
        await reduceStock(item.id, item.variant, item.size, item.quantity);
    }

    sendConfirmationEmail(id, email, name);
}