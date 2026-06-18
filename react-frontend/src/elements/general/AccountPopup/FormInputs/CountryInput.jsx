import { useState, useContext, useRef, useEffect } from "react"
import styles from "../../../../styles/register.module.css"
import {  } from "../AccountPopup"
import { supportedCountries } from "../../../../../../packages/shared"
import { getCountriesData, getUserLocationData } from "../../../../api/countriesData"
import ErrorDropdown from "./ErrorDropdown"
import { getCookie } from "../../../../modules/utils"

export default function CountryInput({ inputData, ref, highlightedFields, activeCountry, setActiveCountry }) {
    const [countryComponents, setCountryComponents] = useState(<p>Loading...</p>)
    const [supportedCountriesData, setSupportedCountriesData] = useState(null)
    const {label, id, small, type, required} = inputData
    const isHighlightedFields = highlightedFields?.includes(id)
    const countryInput = useRef()
    const dropdownId = `${id}-dropdown-input-${Math.random().toString(36).substr(2, 9)}`
    
    useEffect(() => {
        fetchSupportedCountriesData()
        initActiveCountry()
    }, [])

    useEffect(() => {
        mapCountryComponents()
        initActiveCountry()
    }, [supportedCountriesData])

    function initActiveCountry() {
        if (getCookie(`${id}-country-code`) && getCookie(`${id}-country-name`)) {
            setActiveCountry({country_code: getCookie(`${id}-country-code`), name: getCookie(`${id}-country-name`)})
        } else {
            fetchUserLocationCountryName()
        }
    }

    async function fetchUserLocationCountryName() {
        const locationData = await getUserLocationData()
        if (!supportedCountries.includes(locationData.countryCode) && supportedCountriesData) {
            const {name, country_code} = supportedCountriesData[0] //default to first supported country if user country is not supported
            updateActiveCountry({name, country_code})
        } else if(supportedCountries.includes(locationData.countryCode)) {
            updateActiveCountry({name: locationData.countryName, country_code: locationData.countryCode})
        }
    }

    async function fetchSupportedCountriesData() {
        const data = await getCountriesData()
        setSupportedCountriesData(data)
    }

    async function mapCountryComponents() {
        if (!supportedCountriesData) return

        //map to components
        const components = supportedCountriesData.map(data => {
            if(!data.name) return
            return(
                <div key={data.country_code} className={styles.country} onClick={() => onCountryClick({name: data.name, country_code: data.country_code})}>
                    {data.name}
                </div>
            )
        })
        
        //return if one component didn't get mapped
        if(components.findIndex(component => !component) !== -1) return setCountryComponents(<ErrorDropdown/>)

        setCountryComponents(prevComponents => components)
    }

    function onCountryClick(country) {
        countryInput.current.checked = false
        updateActiveCountry(country)
    }

    function updateActiveCountry(country) {
        document.cookie = `${id}-country-code=${country.country_code};`
        document.cookie = `${id}-country-name=${country.name};`
        setActiveCountry(country)
    }

    return(
        <div>
            <label htmlFor={id} className={styles.inputLabel}>{label}{required ? " *" : ""}</label>
            <div
                className={styles.phoneNumber}
                style={{ ...(isHighlightedFields && { borderColor: 'red' }) }}
            >
                <input ref={countryInput} type="checkbox" id={dropdownId} className={styles.countryDropdownInput} style={{display: "none"}}/>
                <label className={styles.countrySelector} htmlFor={dropdownId}>
                    <p className={styles.arrow}>▴</p>
                    <p ref={ref}>{activeCountry ? activeCountry.name : "..."}</p>
                </label>

                <div className={styles.countryDropdown}>
                    {countryComponents}
                </div>
            </div>
        </div>
    )
}