import { getIsVisible } from "./AccountPopup"
import styles from "../../../styles/register.module.css"
import openEye from "../../../assets/open_eye.png"
import closedEye from "../../../assets/closed_eye.png"
import { useState } from "react"

export default function Register() {
    const {isVisible} = getIsVisible('register')

    return (
        <div className={`register ${isVisible ? "" : "hidden"}`}>
            <p>Please enter your details to create an account</p>

            {/*
                Inputs will default to type: "text", small: false and required: true.
                Id will be formated from label if not given.

                TODO: Create phone number input with prefix dropdown.
            */}
            <RegisterDetails inputsData={[{label: "First Name"}, {label: "Last Name"}]}/>
            <RegisterDetails inputsData={[{label: "Country"}]}/>
            <RegisterDetails inputsData={[{label: "City"}, {label: "ZIP code", small: true}]}/>
            <RegisterDetails inputsData={[{label: "Street"}, {label: "House Number", small: true}]}/>
            <RegisterDetails inputsData={[{label: "Email", type: "email"}]}/>
            <RegisterDetails inputsData={[{label: "Phone Number", required: false}]}/>
            <RegisterDetails inputsData={[{label: "Password", type: "password"}]}/>
            <RegisterDetails inputsData={[{label: "Repeat Password", type: "password"}]}/>

            <div className={styles.sumbitRegisterBtn}>register</div>
        </div>
    )

}

function RegisterDetails({ inputsData }) {

    const inputComponents = inputsData.map((data, i) => {
        let {label, id, small, type, required} = data

        if (!id) id = label.toLocaleLowerCase().replaceAll(" ", "_")
        if (!type) type = "text"
        if (required === undefined) required = true

        switch (type) {
            case "password":
                return <Password key={i} label={label} id={id} small={small} i={i} />
            default:
                return <Input key={i} label={label} type={type} id={id} small={small} i={i} required={required} />
        }
        
    })

    return(
        <div className={`${styles.registerDetail}`}>
            {inputComponents}
        </div>
    )
}

function Input({label, id, small, i, type, required }) {
    return(
        <div style={i == 2 ? {} : {marginRight: '4ch'}}>
            <label htmlFor={id} className={styles.inputLabel}>{label}{required ? " *" : ""}</label>
            <input id={id} type={type} className={`${styles.input} ${small ? styles.smallInput : ""}`} />
        </div>
    )  
}

function Password({label, id, small, i }) {
    const [isVisible, setIsVisible] = useState(false)

    function toggleVisible() {
        setIsVisible(prev => !prev)
    }

    return(
        <div style={i == 2 ? {} : {marginRight: '4ch'}}>
            <label htmlFor={id} className={styles.inputLabel}>{label} *</label>
            <div className={styles.password}>
                <input id={id} type={`${isVisible ? "text" : "password"}`} className={`${styles.passwordInput} ${small ? styles.smallInput : ""}`} />
                <img onMouseDown={toggleVisible} src={`${isVisible ? closedEye : openEye}`} alt="toggle visible" />
            </div>
        </div>
    )  
}