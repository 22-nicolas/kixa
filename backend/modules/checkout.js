import { getConversionRates } from "../routes/currency.js";
import { getProductStock } from "../sql/products.js";

export const checkoutTypes = {
    STRIPE: "stripe",
    PAYPAL: "paypal",
};

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

export async function validateCart(items, currency, checkoutType) {
    const conversionRates = await getConversionRates();

    const lineItems = await Promise.all(
        items.map(async (item) => {
            if (!Array.isArray(items)) throw new Error("Invalid items");
            if (item.quantity <= 0) throw new Error("Invalid quantity");
           
            const stockData = await getProductStock(item.id, item.color, item.size);
            

            let price = stockData.price;
            if (currency && conversionRates && stockData) {
                price = convertPrice(stockData.price, currency, conversionRates)
            }
            
            //check stock
            if (stockData.stock < item.quantity) {
                throw new Error(`${item.name} - Out of stock or quantity exceeded stock`);
            }


            if (checkoutType === checkoutTypes.STRIPE) {
                return {
                    price_data: {
                        currency: currency?.toLowerCase() || "eur",
                        product_data: {
                            name: item.name,
                        },
                        // Stripe expects unit_amount in cents (integer)
                        unit_amount: Math.round(Number(price) * 100),
                    },
                    quantity: item.quantity,
                };
            } else if(checkoutType === checkoutTypes.PAYPAL) {
                return {
                    name: item.name,
                    unit_amount: {
                        currency_code: currency?.toUpperCase() || "EUR",
                        value: price,
                    },
                    quantity: item.quantity.toString(),
                }
            }
        })
    )

    return lineItems;
}

function convertPrice(price, currency, conversionRates) {
    const usdPrice = Number(price) / conversionRates["EUR"]
    const convertedPrice = Number((conversionRates[currency] * usdPrice).toFixed(2))

    return convertedPrice
}

export async function handleCompleteCheckout(sessionData, checkoutType) {
    let id;
    let email;
    let name;

    if (checkoutType === checkoutTypes.STRIPE) {
        id = sessionData.metadata.orderId;
        email = sessionData.customer_details?.email;
        name = sessionData.customer_details?.name?.split(" ")[0];
    } else if (checkoutType === checkoutTypes.PAYPAL) {
        id = sessionData.id;
        email = sessionData.payer?.email_address;
        name = sessionData.payer?.name?.given_name;
    }

    sendConfirmationEmail(id, email, name);
    
    await updateOrderStatus(id, "payed");
}