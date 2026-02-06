import { Router } from "express";
import NodeCache from 'node-cache';

export default function countryRoutes(cache) {
    const router = Router();

    if(!cache) {
        cache = new NodeCache({
          stdTTL: 120,
          checkperiod: 20
        });
    }

    router.get("/:country", async (req, res, next) => {
    const country = req.params.country;
    const cacheKey = `country/:${country}`;

    //check cache
    const cached = cache.get(cacheKey);
    if (cached) {
        res.send(cached);
        return;
    }

    const response = await fetch("https://aaapis.com/api/v1/info/country/", {
        method: "POST",
        headers: {
        "Authorization": `Token ${process.env.COUNTRY_API_TOKEN}`,
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        country: country
        })
    });
    const countryData = await response.json();

    //store in cache
    cache.set(cacheKey, countryData, 60);

    res.send(countryData);
    });

    return router
};