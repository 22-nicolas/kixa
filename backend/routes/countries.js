import { Router } from "express";
import { supportedCountries } from "shared";
import cache from "../modules/cache.js";


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

router.get("/locate", async (req, res) => {
    const ip = req.ip;
    const cacheKey = 'locate_' + ip;

    //check cache
    const cached = cache.get(cacheKey);
    if (cached) {
        res.send(cached);
        return;
    }

    const response = await fetch("https://apip.cc/json")
    const data = await response.json();

    const locationData = { countryName: data.CountryName, countryCode: data.CountryCode, phonePrefix: data.PhonePrefix, currency: data.Currency };

    //store in cache
    cache.set(cacheKey, locationData, 3600);

    res.send(locationData);
})

export default router;