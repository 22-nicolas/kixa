import { supportedCountries } from "shared";
import pool from "./db.js";

export async function getShippingCost(country_code) {
    if (!supportedCountries.includes(country_code)) return null;

    const [priceData] = await pool.query(`
        SELECT 
            cz.country_code,
            cz.country_name,
            sc.price
        FROM country_zones cz
        JOIN shipping_costs sc 
            ON cz.zone = sc.zone
        WHERE cz.country_code = ?;
    `, [country_code]);

    return priceData[0]?.price;
}