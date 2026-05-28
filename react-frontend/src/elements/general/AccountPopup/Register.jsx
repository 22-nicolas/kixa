import styles from "../../../styles/register.module.css"
import { act, useContext, useEffect, useRef, useState } from "react"
import { getUserRegionName} from "../../../modules/utils"
import { getCountriesData } from "../../../api/countriesData"
import { registerUser } from "../../../api/users"
import FormInput from "./FormInputs/FormInput"
import { getFormValues } from "../../../modules/forms"
import { ActivePrefixContext, InterfaceContext } from "./AccountPopup"
import { supportedCountries } from "../../../../../packages/shared/index"


export default function Register() {
    const inputRefs = useRef({});
    
    const [succsessMessageVisible, setSuccessMessageVisible] = useState(false)
    const [currentInterface] = useContext(InterfaceContext)
    const [isVisible, setIsVisible] = useState(currentInterface === "register")
    const [errorMessage, setErrorMessage] = useState("")
    const userRegionName = getUserRegionName() //get userRegion to set as default prefix
    const [activePrefix, setActivePrefix] = useContext(ActivePrefixContext)
    const [activeCountry, setActiveCountry] = useState()
    const [highlightedFields, setHighlightedFields] = useState([])

    useEffect(() => {
        setSuccessMessageVisible(false)
        setIsVisible(currentInterface === "register")
        setHighlightedFields([])
        setErrorMessage("")
    }, [currentInterface])

    async function handleSubmit() {
        let result;
        try {
            const formValues = await getFormValues(inputRefs, activeCountry, activePrefix);
            result = await registerUser(formValues)
        } catch (error) {
            setErrorMessage("An error occurred while trying to register. Please try again later.")
            return
        }
        
        if (result.ok) {
            //Dehighlight fields and clear error message
            setHighlightedFields([])
            setErrorMessage("")

            //Clear Inputs
            for (const id in inputRefs.current) {
                if (inputRefs.current[id].current) {
                    inputRefs.current[id].current.value = "";
                }
            }

            //Display success message and hide form
            setIsVisible(false)
            setSuccessMessageVisible(true)
        } else {
            //Display an error message to the user according to the error and highlight incorrect fields/inputs
            const {error, missing} = result
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
                default:
                    setErrorMessage("An error occurred while trying to login. Please try again later.")
            }
        }


        
    }
    return (
        <>
            <div className={`register row ${isVisible ? "" : "hidden"}`}>
                <p>Please enter your details to create an account</p>

                {/*
                    Inputs will default to type: "text", small: false and required: true.
                */}
                <FormInput className="col-12 col-lg-6" inputData={{label: "First Name"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                <FormInput className="col-12 col-lg-6" inputData={{label: "Last Name"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                {/*<FormInput className="col-12" inputData={{label: "Country"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/> */}
                <FormInput className="col-12" inputData={{label: "Country", type: "country", activeCountry, setActiveCountry}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                <FormInput className="col-12 col-lg-6" inputData={{label: "City"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                <FormInput className="col-12 col-lg-6" inputData={{label: "ZIP code", small: true}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                <FormInput className="col-12 col-lg-6" inputData={{label: "Street"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                <FormInput className="col-12 col-lg-6" inputData={{label: "House Number", small: true}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                <FormInput className="col-12" inputData={{label: "Email", type: "email"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                <FormInput className="col-12" inputData={{label: "Phone Number", type: "phone number", required: false}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                <FormInput className="col-12" inputData={{label: "Password", type: "password"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                <FormInput className="col-12" inputData={{label: "Repeat Password", type: "password"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>

                <p className={styles.errorMessage}>{errorMessage}</p>
                <div className={styles.sumbitRegisterBtn} onClick={handleSubmit}>register</div>
            </div>
            <p className={`${succsessMessageVisible ? "" : "hidden"}`}>
                Your account has been created successfully! You can now login with your credentials.
            </p>
        </>
        
        
    )

}