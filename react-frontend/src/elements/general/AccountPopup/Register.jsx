import { getIsVisible } from "./AccountPopup"
import styles from "../../../styles/register.module.css"
import openEye from "../../../assets/open_eye.png"
import closedEye from "../../../assets/closed_eye.png"
import { createContext, useContext, createRef, useEffect, useRef, useState } from "react"
import { supportedCountries, getUserRegionName} from "../../../modules/utils"
import { getCountryData } from "../../../api/countryData"
import { validateUserData } from "../../../api/users"

const HighlightedFieldsContext = createContext()
const ActiveCountryContext = createContext()


export default function Register() {
    const {isVisible} = getIsVisible('register')
    const inputRefs = useRef({});
    const [highlightedFields, setHighlightedFields] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const userRegionName = getUserRegionName() //get userRegion to set as default prefix
    const [activeCountry, setActiveCountry] = useState(userRegionName || supportedCountries[0]) //default back to first supported country (france)

    async function getFormValues() {
        const values = {};
        for (const id in inputRefs.current) {
            if (inputRefs.current[id].current) {
                // add prefix for phone number
                if (id === "phone_number") {
                    const {phone_international_prefix} = await getCountryData(activeCountry)
                    values[id] = `+${phone_international_prefix}${inputRefs.current[id].current.value}`
                } else {
                    values[id] = inputRefs.current[id].current.value;
                }
            }
        }
        return values;
    }

    async function handleSubmit() {
        const formValues = await getFormValues();
        const errorData = await validateUserData(formValues)
        
        //if no error dehighlight all and clear error
        if (!errorData) {
            setHighlightedFields([])
            setErrorMessage("")
            return
        }

        //Display an error message to the user according to the error and highlight incorrect fields/inputs
        const {error, missing} = errorData
        switch (error) {
            case "Missing required fields":
                setHighlightedFields(missing)
                setErrorMessage("Please fill out all required fields!")
                break;
            case "Invalid email format":
                setHighlightedFields(["email"])
                setErrorMessage("Please provide a valid email address!")
                break;
            case "Email already exists":
                setHighlightedFields(["email"])
                setErrorMessage("Your email is already in use! Did you mean to login?")
                break;
            case "Passwords do not match":
                setHighlightedFields(["password", "repeat_password"])
                setErrorMessage("Passwords do not match!")
                break;
        }

        if (error) return
    }
    return (
        <div className={`register ${isVisible ? "" : "hidden"}`}>
            <p>Please enter your details to create an account</p>

            {/*
                Inputs will default to type: "text", small: false and required: true.
                Id will be formated from label if not given.
            */}
            <ActiveCountryContext.Provider value={[activeCountry, setActiveCountry]}>
                <HighlightedFieldsContext.Provider value={highlightedFields}>
                    <RegisterDetails inputsData={[{label: "First Name"}, {label: "Last Name"}]} inputRefs={inputRefs}/>
                    <RegisterDetails inputsData={[{label: "Country"}]} inputRefs={inputRefs}/>
                    <RegisterDetails inputsData={[{label: "City"}, {label: "ZIP code", small: true}]} inputRefs={inputRefs}/>
                    <RegisterDetails inputsData={[{label: "Street"}, {label: "House Number", small: true}]} inputRefs={inputRefs}/>
                    <RegisterDetails inputsData={[{label: "Email", type: "email"}]} inputRefs={inputRefs}/>
                    <RegisterDetails inputsData={[{label: "Phone Number", type: "phone number", required: false}]} inputRefs={inputRefs}/>
                    <RegisterDetails inputsData={[{label: "Password", type: "password"}]} inputRefs={inputRefs}/>
                    <RegisterDetails inputsData={[{label: "Repeat Password", type: "password"}]} inputRefs={inputRefs}/>
            </HighlightedFieldsContext.Provider>
            </ActiveCountryContext.Provider>

            <p className={styles.errorMessage}>{errorMessage}</p>
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
    const highlightedFields = useContext(HighlightedFieldsContext)
    const isHighlightedFields = highlightedFields.includes(id);

    return(
        <div style={{ ...(i !== 2 && { marginRight: '4ch' }) }}>
            <label htmlFor={id} className={styles.inputLabel}>{label}{required ? " *" : ""}</label>
            <input ref={ref} id={id} type={type} 
                   className={`${styles.input} ${small ? styles.smallInput : ""}`} 
                   style={{ ...(isHighlightedFields && { borderColor: 'red' }) }} />
        </div>
    )  
}

function Password({label, id, small, i, ref }) {
    const [isVisible, setIsVisible] = useState(false)
    const highlightedFields = useContext(HighlightedFieldsContext)
    const isHighlightedFields = highlightedFields.includes(id)

    function toggleVisible() {
        setIsVisible(prev => !prev)
    }

    return(
        <div style={{ ...(i !== 2 && { marginRight: '4ch' }) }}>
            <label htmlFor={id} className={styles.inputLabel}>{label} *</label>
            <div 
                className={styles.password} 
                style={{ ...(isHighlightedFields && { borderColor: 'red' }) }}
            >
                <input ref={ref} id={id} type={`${isVisible ? "text" : "password"}`} className={`${styles.passwordInput} ${small ? styles.smallInput : ""}`} />
                <img onMouseDown={toggleVisible} src={`${isVisible ? closedEye : openEye}`} alt="toggle visible" />
            </div>
        </div>
    )  
}

function PhoneNumber({ label, id, small, i, ref }) {
    const countryInput = useRef()
    const [countryComponents, setCountryComponents] = useState(<p>Loading...</p>)
    const [activeCountry, setActiveCountry] = useContext(ActiveCountryContext)
    const [activeCountryComponent, setActiveCountryComponent] = useState(
        <label className={styles.countrySelector} htmlFor="country-dropdown-input">
            <p className={styles.arrow}>▴</p>
            <p>...</p>
        </label>
    )
    const highlightedFields = useContext(HighlightedFieldsContext)
    const isHighlightedFields = highlightedFields.includes(id)
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
    
    return(
        <div style={{ ...(i !== 2 && { marginRight: '4ch' }) }}>
            <label htmlFor={id} className={styles.inputLabel}>{label} *</label>
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