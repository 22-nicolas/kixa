import { useEffect, useContext, useState, useRef } from "react"
import { InterfaceContext, HighlightedFieldsContext } from "./AccountPopup"
import styles from "../../../styles/register.module.css"
import FormInput from "./FormInputs/FormInput"
import { loginUser } from "../../../api/users"

export default function Login() {
    const [errorMessage, setErrorMessage] = useState("")
    const [succsessMessageVisible, setSuccessMessageVisible] = useState(false)
    const [currentInterface] = useContext(InterfaceContext)
    const [isVisible, setIsVisible] = useState(currentInterface === "login")
    const [highlightedFields, setHighlightedFields] = useContext(HighlightedFieldsContext)
    const inputRefs = useRef({});
    useEffect(() => {
        setSuccessMessageVisible(false)
        setIsVisible(currentInterface === "login")
    }, [currentInterface])

    async function handleSubmit() {
        const result = await loginUser(inputRefs.current.email.current.value, inputRefs.current.password.current.value)
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
                case "Cannot find user":
                    setHighlightedFields(["email"])
                    setErrorMessage("Cannot find user with this email address!")
                    break;
                case "Wrong password":
                    setHighlightedFields(["password"])
                    setErrorMessage("Incorrect password!")
                    break;
                default:
                    setErrorMessage("An error occurred while trying to login. Please try again later.")
            }
        }
    }

    return(
        <>
            <div className={`login ${isVisible ? "" : "hidden"}`}>
                <p>Please enter your details to login</p>
                <FormInput inputData={[{label: "Email", type: "email"}]} inputRefs={inputRefs}/>
                <FormInput inputData={[{label: "Password", type: "password"}]} inputRefs={inputRefs}/>

                <p className={styles.errorMessage}>{errorMessage}</p>
                <div className={styles.sumbitRegisterBtn} onClick={handleSubmit}>login</div>
            </div>
            <p className={`${succsessMessageVisible ? "" : "hidden"}`}>
                Successfully logged in!
            </p>
        </>
    )
}