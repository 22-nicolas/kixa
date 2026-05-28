import { use, useContext, useEffect, useRef, useState } from "react"
import { ActivePrefixContext as PrefixContext } from "../AccountPopup"
import { InterfaceContext } from "../AccountPopup"
import styles from "../../../../styles/register.module.css"
import { getCountriesData } from "../../../../api/countriesData"
import {  } from "../AccountPopup"
import { supportedCountries } from "../../../../../../packages/shared"
import ErrorDropdown from "./ErrorDropdown"

export default function PhoneNumberInput({ inputData, ref, highlightedFields }) {
    const {label, id, small, type, required} = inputData
    const [currentInterface] = useContext(InterfaceContext)
    const [supportedCountriesData, setSupportedCountriesData] = useState(null)
    const [activePrefix, setActivePrefix] = useContext(PrefixContext);
    const dropdownId = `${id}-prefix-dropdown-input-${Math.random().toString(36).substr(2, 9)}`

    const prefixInput = useRef()
    const [prefixComponents, setPrefixComponents] = useState(<p>Loading...</p>)
    const [activePrefixComponent, setActivePrefixComponent] = useState(
        <label className={styles.prefixSelector} htmlFor={dropdownId}>
            <p className={styles.arrow}>▴</p>
            <p>...</p>
        </label>
    )

    const isHighlightedFields = highlightedFields.includes(id)
    useEffect(() => {
        fetchSupportedCountriesData()
    }, [])

    useEffect(() => {
        mapPrefixComponents()
    }, [supportedCountriesData])

    useEffect(() => {
        mapActivePrefixComponent()
    }, [activePrefix, supportedCountriesData])
    
    async function fetchSupportedCountriesData() {
        const data = await getCountriesData()
        setSupportedCountriesData(data)
    }

    async function mapActivePrefixComponent(){
        if (!activePrefix || !supportedCountriesData) return
        const prefixData = supportedCountriesData.find(item => item.country_code === activePrefix)
        setActivePrefixComponent(
            <label className={styles.prefixSelector} htmlFor={dropdownId}>
                <p className={styles.arrow}>▴</p>
                <p>{prefixData?.flag}</p>
                <p>+{prefixData?.phone_international_prefix}</p>
            </label>
        )
    }

    function onPrefixClick(prefix) {
        prefixInput.current.checked = false
        setActivePrefix(prefix)
    }


    async function mapPrefixComponents() {
        if (!supportedCountriesData) return

        //map to components
        const components = supportedCountriesData.map((data, i) => {
            if(!data.name) return
            return(
                <div key={i} className={styles.prefix} onMouseDown={() => onPrefixClick(data.country_code)}>
                    <p>{data.flag}</p>
                    <p>+{data.phone_international_prefix}</p>
                </div>
            )
        })
        
        //return if one component didn't get mapped
        if(components.findIndex(component => !component) !== -1) return setPrefixComponents(<ErrorDropdown/>)

        setPrefixComponents(prevComponents => components)
    }
    
    return(
        <div>
            <label htmlFor={id} className={styles.inputLabel}>{label}{required ? " *" : ""}</label>
            <div 
                className={styles.phoneNumber}
                style={{ ...(isHighlightedFields && { borderColor: 'red' }) }}
            >
                <input ref={prefixInput} type="checkbox" id={dropdownId} className={styles.prefixDropdownInput} style={{display: "none"}}/>
                {activePrefixComponent}

                <div className={styles.prefixDropdown}>
                    {prefixComponents}
                </div>
                <input ref={ref} type="text" id={id} className={`${styles.input} ${small ? styles.smallInput : ""}`} />
                
            </div>
        </div>
    )
}