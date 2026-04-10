import { Router } from "express";
import NodeCache from 'node-cache';
import { supportedCountries } from "shared";

export default function countryRoutes(cache) {
    const router = Router();

    if(!cache) {
        cache = new NodeCache({
          stdTTL: 0,
        });
    }

    router.get("/", async (req, res, next) => {
        const cacheKey = `countries`;

        //check cache
        const cached = cache.get(cacheKey);
        if (cached) {
            res.send(cached);
            return;
        }

        const response = await fetch(process.env.COUNTRY_API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Token ${process.env.COUNTRY_API_TOKEN}`,
                "Content-Type": "application/json"
            },
        });
        //console.log(response)
        const {countries} = await response.json();
        //console.log(countriesData)
        //filter out none supported countries
        const filteredCountriesData = countries.filter(data => supportedCountries.includes(data.country_code));

        //store in cache
        cache.set(cacheKey, filteredCountriesData, 60);

        res.send(filteredCountriesData);
    });

    return router
};