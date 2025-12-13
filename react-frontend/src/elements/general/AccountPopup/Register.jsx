import { getIsVisible } from "./AccountPopup"
import styles from "../../../styles/register.module.css"
import openEye from "../../../assets/open_eye.png"
import closedEye from "../../../assets/closed_eye.png"
import { useEffect, useState } from "react"
import { supportedCountries } from "../../../modules/utils"
import { getCountryData } from "../../../api/countryData"

export default function Register() {
    const {isVisible} = getIsVisible('register')

    return (
        <div className={`register ${isVisible ? "" : "hidden"}`}>
            <p>Please enter your details to create an account</p>

            {/*
                Inputs will default to type: "text", small: false and required: true.
                Id will be formated from label if not given.
            */}
            <RegisterDetails inputsData={[{label: "First Name"}, {label: "Last Name"}]}/>
            <RegisterDetails inputsData={[{label: "Country"}]}/>
            <RegisterDetails inputsData={[{label: "City"}, {label: "ZIP code", small: true}]}/>
            <RegisterDetails inputsData={[{label: "Street"}, {label: "House Number", small: true}]}/>
            <RegisterDetails inputsData={[{label: "Email", type: "email"}]}/>
            <RegisterDetails inputsData={[{label: "Phone Number", type: "phone number", required: false}]}/>
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
            case "phone number":
                return <PhoneNumber key={i} label={label} id={id} small={small} i={i} />
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

function PhoneNumber({ label, id, small, i }) {
    const [countryComponents, setCountryComponents] = useState(<p>Loading...</p>)

    useEffect(() => {
        mapCountryComponents()
    }, [])
    
    async function mapCountryComponents() {
        //fetch country data
        const countryData = await Promise.all(
            supportedCountries.map(country => getCountryData(country))
        )

        //map to components
        const components = countryData.map((data, i) => {
            if(!data.name) return
            return(
                <div key={i} className={styles.country}>
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
        <div style={i == 2 ? {} : {marginRight: '4ch'}}>
            <label htmlFor={id} className={styles.inputLabel}>{label} *</label>
            <div className={styles.phoneNumber}>
                <input type="checkbox" id="country-dropdown-input" className={styles.countryDropdownInput} style={{display: "none"}}/>
                <label className={styles.countrySelector} htmlFor="country-dropdown-input">
                    <p className={styles.arrow}>▴</p>
                    <img src="flags/germany.png"/>
                    <p>+49</p>
                </label>

                <div className={styles.countryDropdown}>
                    {countryComponents}
                </div>
                <input type="text" id={id} className={`${styles.input} ${small ? styles.smallInput : ""}`} />
                
            </div>
        </div>
    )
}

function ErrorDropdown() {
    return <div style={{color: "grey", fontSize: "0.8rem"}}>There was an issue while loading. Please try again later.</div>
}