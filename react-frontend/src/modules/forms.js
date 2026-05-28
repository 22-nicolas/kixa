import { getCountriesData } from "../api/countriesData";

export async function getFormValues(inputRefs, activeCountry, activePrefix) {
    const values = {};
    for (const id in inputRefs.current) {
        if (inputRefs.current[id].current) {
            // add prefix for phone number
            switch (id) {
                case "phone_number":
                    const countriesData = await getCountriesData()
                    const {phone_international_prefix} = countriesData?.find(data => data.country_code === activePrefix)
                    values[id] = `+${phone_international_prefix}${inputRefs.current[id].current.value}`
                    break;
                case "country":
                    values[id] = activeCountry
                    break;
                default:
                    values[id] = inputRefs.current[id].current.value;
                    break;
            }
        }
    }
    return values;
}