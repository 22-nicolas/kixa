import { Router } from "express";
import NodeCache from 'node-cache';

export default function currencyRoutes(cache) {
    const router = Router();

    if(!cache) {
        cache = new NodeCache({
          stdTTL: 3600,
          checkperiod: 3600
        });
    }

    router.get("/", async (req, res, next) => {
        const cacheKey = 'currency'

        //check cache
        const cached = cache.get(cacheKey);
        if (cached) {
            res.send(cached);
            return;
        }

        // Construct URL with query parameters for a GET request
        const url = new URL(process.env.CURRENCY_API_URL);
        url.searchParams.append('app_id', process.env.CURRENCY_TOKEN);

        const response = await fetch(url);
        
        const currencyData = await response.json();
        console.log(currencyData)
        
        //store in cache
        cache.set(cacheKey, currencyData, 60);

        res.send(currencyData);
    });

    return router
};