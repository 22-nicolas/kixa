import { Router } from "express";
import cache from "../modules/cache.js";


const router = Router();

router.get("/conversion-rates", async (req, res) => {
    const currencyData = await getConversionRates();
    //console.log(currencyData)
    res.send(currencyData);
});

router.get("/user-preference", async (req, res) => {
    const ip = req.ip;
    const cacheKey = 'preference_' + ip;

    //check cache
    const cached = cache.get(cacheKey);
    if (cached) {
        res.send(cached);
        return;
    }

    const response = await fetch("https://apip.cc/json")
    const data = await response.json();

    const currencyData = { currency: data.Currency };

    //store in cache
    cache.set(cacheKey, currencyData, 3600);
    
    res.send(currencyData);
})

export default router;

export async function getConversionRates() {
    const cacheKey = 'currency'

    //check cache
    const cached = cache.get(cacheKey);
    if (cached) {
        return cached;
    }

    // Construct URL with query parameters for a GET request
    const url = new URL(process.env.CURRENCY_API_URL);
    url.searchParams.append('app_id', process.env.CURRENCY_TOKEN);

    const response = await fetch(url);
    
    const currencyData = await response.json();
    const conversionRates = currencyData.rates;
    
    //store in cache
    cache.set(cacheKey, conversionRates, 3600);

    return conversionRates;
}