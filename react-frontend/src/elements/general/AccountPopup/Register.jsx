import { getIsVisible } from "./AccountPopup"
import styles from "../../../styles/register.module.css"
import openEye from "../../../assets/open_eye.png"
import closedEye from "../../../assets/closed_eye.png"
import { createRef, useEffect, useRef, useState } from "react"
import { supportedCountries } from "../../../modules/utils"
import { getCountryData } from "../../../api/countryData"
import { register } from "../../../api/users"

export default function Register() {
    const {isVisible} = getIsVisible('register')
    const inputRefs = useRef({});

    function getFormValues() {
        const values = {};
        for (const id in inputRefs.current) {
            if (inputRefs.current[id].current) {
                values[id] = inputRefs.current[id].current.value;
            }
        }
        return values;
    }

    function handleSubmit() {
        const formValues = getFormValues();
        register(formValues)
    }
    return (
        <div className={`register ${isVisible ? "" : "hidden"}`}>
            <p>Please enter your details to create an account</p>

            {/*
                Inputs will default to type: "text", small: false and required: true.
                Id will be formated from label if not given.
            */}
            <RegisterDetails inputsData={[{label: "First Name"}, {label: "Last Name"}]} inputRefs={inputRefs}/>
            <RegisterDetails inputsData={[{label: "Country"}]} inputRefs={inputRefs}/>
            <RegisterDetails inputsData={[{label: "City"}, {label: "ZIP code", small: true}]} inputRefs={inputRefs}/>
            <RegisterDetails inputsData={[{label: "Street"}, {label: "House Number", small: true}]} inputRefs={inputRefs}/>
            <RegisterDetails inputsData={[{label: "Email", type: "email"}]} inputRefs={inputRefs}/>
            <RegisterDetails inputsData={[{label: "Phone Number", type: "phone number", required: false}]} inputRefs={inputRefs}/>
            <RegisterDetails inputsData={[{label: "Password", type: "password"}]} inputRefs={inputRefs}/>
            <RegisterDetails inputsData={[{label: "Repeat Password", type: "password"}]} inputRefs={inputRefs}/>

            <div className={styles.sumbitRegisterBtn} onClick={handleSubmit}>register</div>
        </div>
    )

}

function RegisterDetails({ inputsData, inputRefs }) {

    const inputComponents = inputsData.map((data, i) => {
        let {label, id, small, type, required} = data

        if (!id) id = label.toLocaleLowerCase().replaceAll(" ", "_")
        if (!type) type = "text"
        if (required === undefined) required = true

        const ref = createRef();
        inputRefs.current[id] = ref;

        switch (type) {
            case "phone number":
                return <PhoneNumber key={i} label={label} id={id} small={small} i={i} ref={ref} />
            case "password":
                return <Password key={i} label={label} id={id} small={small} i={i} ref={ref} />
            default:
                return <Input key={i} label={label} type={type} id={id} small={small} i={i} required={required} ref={ref} />
        }
        
    })

    return(
        <div className={`${styles.registerDetail}`}>
            {inputComponents}
        </div>
    )
}

function Input({label, id, small, i, type, required, ref }) {
    return(
        <div style={i == 2 ? {} : {marginRight: '4ch'}}>
            <label htmlFor={id} className={styles.inputLabel}>{label}{required ? " *" : ""}</label>
            <input ref={ref} id={id} type={type} className={`${styles.input} ${small ? styles.smallInput : ""}`} />
        </div>
    )  
}

function Password({label, id, small, i, ref }) {
    const [isVisible, setIsVisible] = useState(false)

    function toggleVisible() {
        setIsVisible(prev => !prev)
    }

    return(
        <div style={i == 2 ? {} : {marginRight: '4ch'}}>
            <label htmlFor={id} className={styles.inputLabel}>{label} *</label>
            <div className={styles.password}>
                <input ref={ref} id={id} type={`${isVisible ? "text" : "password"}`} className={`${styles.passwordInput} ${small ? styles.smallInput : ""}`} />
                <img onMouseDown={toggleVisible} src={`${isVisible ? closedEye : openEye}`} alt="toggle visible" />
            </div>
        </div>
    )  
}

function PhoneNumber({ label, id, small, i, ref }) {
    const userRegionName = getUserRegionName() //get userRegion to set as default prefix
    const countryInput = useRef()
    const [countryComponents, setCountryComponents] = useState(<p>Loading...</p>)
    const [activeCountry, setActiveCountry] = useState(userRegionName || supportedCountries[0]) //default back to first supported country (france)
    const [activeCountryComponent, setActiveCountryComponent] = useState(
        <label className={styles.countrySelector} htmlFor="country-dropdown-input">
            <p className={styles.arrow}>▴</p>
            <p>...</p>
        </label>
    )

    useEffect(() => {
        mapCountryComponents()
    }, [])

    useEffect(() => {
        mapActiveCountryComponent()
    }, [activeCountry])

    async function mapActiveCountryComponent(){
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

    function getUserRegionName() {
        const navigator = window.navigator
        const locale = new Intl.Locale(navigator.language)
        const userRegionCode = locale.region

        if (!userRegionCode) return

        const regionNames = new Intl.DisplayNames(
            ["en-US"],
            { type: 'region'}
        )

        return regionNames.of(userRegionCode)
    }
    
    return(
        <div style={i == 2 ? {} : {marginRight: '4ch'}}>
            <label htmlFor={id} className={styles.inputLabel}>{label} *</label>
            <div className={styles.phoneNumber}>
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