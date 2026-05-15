import { use, useContext, useEffect, useRef, useState } from "react"
import { ActiveCountryContext as CountryContext } from "../AccountPopup"
import { InterfaceContext } from "../AccountPopup"
import styles from "../../../../styles/register.module.css"
import { getCountriesData } from "../../../../api/countriesData"
import { HighlightedFieldsContext } from "../AccountPopup"
import { supportedCountries } from "../../../../../../packages/shared"

export default function PhoneNumberInput({ label, id, small, i, ref }) {
    const [currentInterface] = useContext(InterfaceContext)
    const [highlightedFields] = useContext(HighlightedFieldsContext)
    const [supportedCountriesData, setSupportedCountriesData] = useState(null)
    const [activeCountry, setActiveCountry] = useContext(CountryContext);

    const countryInput = useRef()
    const [countryComponents, setCountryComponents] = useState(<p>Loading...</p>)
    const [activeCountryComponent, setActiveCountryComponent] = useState(
        <label className={styles.countrySelector} htmlFor="country-dropdown-input">
            <p className={styles.arrow}>▴</p>
            <p>...</p>
        </label>
    )

    const isHighlightedFields = highlightedFields.includes(id)
    useEffect(() => {
        fetchSupportedCountriesData()
    }, [])

    useEffect(() => {
        mapCountryComponents()
    }, [supportedCountriesData])

    useEffect(() => {
        mapActiveCountryComponent()
    }, [activeCountry, supportedCountriesData])
    
    async function fetchSupportedCountriesData() {
        const data = await getCountriesData()
        setSupportedCountriesData(data)
    }

    async function mapActiveCountryComponent(){
        if (!activeCountry || !supportedCountriesData) return
        const countryData = supportedCountriesData.find(item => item.country_code === activeCountry)
        setActiveCountryComponent(
            <label className={styles.countrySelector} htmlFor="country-dropdown-input">
                <p className={styles.arrow}>▴</p>
                <p>{countryData?.flag}</p>
                <p>+{countryData?.phone_international_prefix}</p>
            </label>
        )
    }

    function onCountryClick(country) {
        countryInput.current.checked = false
        setActiveCountry(country)
    }


    async function mapCountryComponents() {
        if (!supportedCountriesData) return

        //map to components
        const components = supportedCountriesData.map((data, i) => {
            if(!data.name) return
            return(
                <div key={i} className={styles.country} onMouseDown={() => onCountryClick(data.country_code)}>
                    <p>{data.flag}</p>
                    <p>+{data.phone_international_prefix}</p>
                </div>
            )
        })
        
        //return if one component didn't get mapped
        if(components.findIndex(component => !component) !== -1) return setCountryComponents(<ErrorDropdown/>)

        setCountryComponents(prevComponents => components)
    }
    
    return(
        <div>
            <label htmlFor={id} className={styles.inputLabel}>{label}</label>
            <div 
                className={styles.phoneNumber}
                style={{ ...(isHighlightedFields && { borderColor: 'red' }) }}
            >
                <input ref={countryInput} type="checkbox" id="country-dropdown-input" className={styles.countryDropdownInput} style={{display: "none"}}/>
                {activeCountryComponent}

                <div className={styles.countryDropdown}>
                    {countryComponents}
                </div>
                <input ref={ref} type="text" id={id} className={`${styles.input} ${small ? styles.smallInput : ""}`} />
                
            </div>
        </div>
    )
}

function ErrorDropdown() {
    return <div style={{color: "grey", fontSize: "0.8rem"}}>There was an issue while loading. Please try again later.</div>
}