import { useState, useContext, useRef, useEffect } from "react"
import styles from "../../../../styles/register.module.css"
import { HighlightedFieldsContext } from "../AccountPopup"
import { supportedCountries } from "../../../../../../packages/shared"
import { getCountriesData, getUserCountryName } from "../../../../api/countriesData"
import ErrorDropdown from "./ErrorDropdown"

export default function CountryInput({ label, id, small, i, ref, activeCountry, setActiveCountry }) {
    const [highlightedFields] = useContext(HighlightedFieldsContext)
    const [countryComponents, setCountryComponents] = useState(<p>Loading...</p>)
    const [supportedCountriesData, setSupportedCountriesData] = useState(null)
    const isHighlightedFields = highlightedFields.includes(id)
    const countryInput = useRef()
    
    useEffect(() => {
        fetchSupportedCountriesData()
        fetchUserLocationCountryName()
    }, [])

    useEffect(() => {
        mapCountryComponents()
    }, [supportedCountriesData])

    async function fetchUserLocationCountryName() {
        const name = await getUserCountryName()
        setActiveCountry(name)
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
                <div key={data.name} className={styles.country} onClick={() => onCountryClick(data.name)}>
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
        setActiveCountry(country)
    }

    return(
        <div>
            <label htmlFor={id} className={styles.inputLabel}>{label}</label>
            <div 
                className={styles.countryInput}
                style={{ ...(isHighlightedFields && { borderColor: 'red' }) }}
            >
                <input ref={countryInput} type="checkbox" id="country-dropdown-input" className={styles.countryDropdownInput} style={{display: "none"}}/>
                <label className={styles.countrySelector} htmlFor="country-dropdown-input">
                    <p className={styles.arrow}>▴</p>
                    <p ref={ref}>{activeCountry ? activeCountry : "..."}</p>
                </label>

                <div className={styles.countryDropdown}>
                    {countryComponents}
                </div>
            </div>
        </div>
    )
}