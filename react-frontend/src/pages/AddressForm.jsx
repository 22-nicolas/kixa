import Header from "../elements/general/Header";
import LoginPopup from "../elements/general/AccountPopup/AccountPopup"
import Footer from "../elements/general/Footer"
import Container from "../elements/general/Container";
import FormInput from "../elements/general/AccountPopup/FormInputs/FormInput";
import styles from "../styles/register.module.css"
import { useRef, useState } from "react";
import { getFormValues } from "../modules/forms";
import { validateAddressForm } from "../api/checkout";

export default function Checkout() {
    const [activeCountry, setActiveCountry] = useState();
    const [highlightedFields, setHighlightedFields] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const inputRefs = useRef({});

    async function handleSubmit() {
        let result;
        try {
            const formValues = await getFormValues(inputRefs, activeCountry);
            result = await validateAddressForm(formValues)
        } catch (error) {
            setErrorMessage(error.message)//"An error occurred while trying to register. Please try again later.")
            return
        }
        
        if (result.ok) {
            
        } else {
            //Display an error message to the user according to the error and highlight incorrect fields/inputs
            const {error, missing} = result
            switch (error) {
                case "Missing required fields":
                    setHighlightedFields(missing)
                    console.log(missing)
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
                    setErrorMessage(error)//"An error occurred while trying to process your address. Please try again later.")
            }
        }
    }

    return(
        <>
            <Header/>
            <LoginPopup/>

                <Container>
                    <div className={`row`}>
                        <p>Please enter your address details to continue.</p>

                        <FormInput className="col-12 col-lg-6" inputData={{label: "First Name"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                        <FormInput className="col-12 col-lg-6" inputData={{label: "Last Name"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                        <FormInput className="col-12" inputData={{label: "Country", type: "country", activeCountry, setActiveCountry}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                        <FormInput className="col-12 col-lg-6" inputData={{label: "City"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                        <FormInput className="col-12 col-lg-6" inputData={{label: "ZIP code", small: true}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                        <FormInput className="col-12 col-lg-6" inputData={{label: "Street"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                        <FormInput className="col-12 col-lg-6" inputData={{label: "House Number", small: true}} highlightedFields={highlightedFields} inputRefs={inputRefs}/>
                        {/* <FormInput className="col-12" inputData={{label: "Email", type: "email"}} highlightedFields={highlightedFields} inputRefs={inputRefs}/> */}

                        <p className={styles.errorMessage}>{errorMessage}</p>
                        <div className="btn btn-success col-3 col-lg-2 align-self-end" onClick={handleSubmit}>next</div>
                    </div>
                </Container>

            <Footer/>
        </>
    )
}