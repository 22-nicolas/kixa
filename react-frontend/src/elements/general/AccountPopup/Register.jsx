import { getIsVisible } from "./AccountPopup"
import styles from "../../../styles/register.module.css"
import { useContext, useRef, useState } from "react"
import { supportedCountries, getUserRegionName} from "../../../modules/utils"
import { getCountryData } from "../../../api/countryData"
import { validateUserData } from "../../../api/users"
import FormInput from "./FormInputs/FormInput"
import { HighlightedFieldsContext } from "./AccountPopup"

//export const HighlightedFieldsContext = createContext()
//export const ActiveCountryContext = createContext()


export default function Register() {
    const {isVisible} = getIsVisible('register')
    const inputRefs = useRef({});
    
    const [errorMessage, setErrorMessage] = useState("")
    const userRegionName = getUserRegionName() //get userRegion to set as default prefix
    const [activeCountry, setActiveCountry] = useState(userRegionName || supportedCountries[0]) //default back to first supported country (france)
    const [highlightedFields, setHighlightedFields] = useContext(HighlightedFieldsContext)

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
            <FormInput inputData={[{label: "First Name"}, {label: "Last Name"}]} inputRefs={inputRefs}/>
            <FormInput inputData={[{label: "Country"}]} inputRefs={inputRefs}/>
            <FormInput inputData={[{label: "City"}, {label: "ZIP code", small: true}]} inputRefs={inputRefs}/>
            <FormInput inputData={[{label: "Street"}, {label: "House Number", small: true}]} inputRefs={inputRefs}/>
            <FormInput inputData={[{label: "Email", type: "email"}]} inputRefs={inputRefs}/>
            <FormInput inputData={[{label: "Phone Number", type: "phone number", required: false}]} inputRefs={inputRefs}/>
            <FormInput inputData={[{label: "Password", type: "password"}]} inputRefs={inputRefs}/>
            <FormInput inputData={[{label: "Repeat Password", type: "password"}]} inputRefs={inputRefs}/>

            <p className={styles.errorMessage}>{errorMessage}</p>
            <div className={styles.sumbitRegisterBtn} onClick={handleSubmit}>register</div>
        </div>
    )

}