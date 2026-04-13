import { Router } from "express";
import { supportedCountries } from "shared";
import cache from "../cache.js";


const router = Router();

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

    const {countries} = await response.json();

    //filter out none supported countries
    const filteredCountriesData = countries.filter(data => supportedCountries.includes(data.country_code));

    //store in cache
    cache.set(cacheKey, filteredCountriesData, 0);

    res.send(filteredCountriesData);
});

export default router;