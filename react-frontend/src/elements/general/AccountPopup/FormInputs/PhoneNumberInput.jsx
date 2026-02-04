import { useContext, useEffect, useRef, useState } from "react"
import { ActiveCountryContext as CountryContext } from "../AccountPopup"
import { InterfaceContext } from "../AccountPopup"
import styles from "../../../../styles/register.module.css"
import { getCountryData } from "../../../../api/countryData"
import { supportedCountries } from "../../../../modules/utils"
import { HighlightedFieldsContext } from "../AccountPopup"

export default function PhoneNumberInput({ label, id, small, i, ref }) {
    const [currentInterface] = useContext(InterfaceContext)
    //let CountryContext

    const [highlightedFields] = useContext(HighlightedFieldsContext)


    const countryContextValue = useContext(CountryContext || InterfaceContext); // Use a dummy context when CountryContext is null
    let [activeCountry, setActiveCountry] = CountryContext ? countryContextValue : [];

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
        mapCountryComponents()
    }, [])

    useEffect(() => {
        mapActiveCountryComponent()
    }, [activeCountry])
    
    useEffect(() => {
        [activeCountry, setActiveCountry] = CountryContext ? countryContextValue : [];
    }, [currentInterface])

    async function mapActiveCountryComponent(){
        if (!activeCountry) return
        const data = await getCountryData(activeCountry)
        setActiveCountryComponent(
            <label className={styles.countrySelector} htmlFor="country-dropdown-input">
                <p className={styles.arrow}>▴</p>
                <p>{data.flag}</p>
                <p>+{data.phone_international_prefix}</p>
            </label>
        )
    }

    function onCountryClick(country) {
        countryInput.current.checked = false
        setActiveCountry(country)
    }


    async function mapCountryComponents() {
        //fetch country data
        const countryData = await Promise.all(
            supportedCountries.map(country => getCountryData(country))
        )

        //map to components
        const components = countryData.map((data, i) => {
            if(!data.name) return
            return(
                <div key={i} className={styles.country} onMouseDown={() => onCountryClick(data.name)}>
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
        <div style={{ ...(i !== 2 && { marginRight: '4ch' }) }}>
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