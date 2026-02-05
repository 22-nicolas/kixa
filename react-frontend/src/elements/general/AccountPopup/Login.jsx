import { createContext, useState, useRef } from "react"
import { getIsVisible } from "./AccountPopup"
import styles from "../../../styles/register.module.css"
import FormInput from "./FormInputs/FormInput"
import { loginUser } from "../../../api/users"

export const HighlightedFieldsContext = createContext()

export default function Login() {
    const {isVisible} = getIsVisible('login')
    const [highlightedFields, setHighlightedFields] = useState([])
    const inputRefs = useRef({});

    async function handleSubmit() {
        const response = await loginUser(inputRefs.current.email.current.value, inputRefs.current.password.current.value)
        
        if (response.ok) {
            //TODO: handle correct login
        } else {
            //TODO: handle error
        }
    }

    return(
        <div className={`login ${isVisible ? "" : "hidden"}`}>
            <HighlightedFieldsContext.Provider value={highlightedFields}>
                <p>Please enter your details to login</p>
                <FormInput inputData={[{label: "Email", type: "email"}]} inputRefs={inputRefs}/>
                <FormInput inputData={[{label: "Password", type: "password"}]} inputRefs={inputRefs}/>
            </HighlightedFieldsContext.Provider>

            {/*<p className={styles.errorMessage}>{errorMessage}</p>*/}
            <div className={styles.sumbitRegisterBtn} onClick={handleSubmit}>login</div>
        </div>
    )
}