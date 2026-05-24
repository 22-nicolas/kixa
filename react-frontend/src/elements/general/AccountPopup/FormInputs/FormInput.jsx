import { createRef } from "react"
import PasswordInput from "./PasswordInput"
import PhoneNumberInput from "./PhoneNumberInput"
import TextInput from "./TextInput"
import styles from "../../../../styles/register.module.css"
import CountryInput from "./CountryInput"

export default function FormInput({ className, inputData, inputRefs }) {
    let {label, id, small, type, required} = inputData

    if (!id) id = label?.toLocaleLowerCase().replaceAll(" ", "_")
    if (!type) type = "text"
    if (required === undefined) required = true

    const ref = createRef();
    inputRefs.current[id] = ref;

    let inputComponent;

    switch (type) {
        case "phone number":
            inputComponent = <PhoneNumberInput label={label} id={id} small={small} ref={ref} />
                break;
        case "password":
            inputComponent = <PasswordInput label={label} id={id} small={small} ref={ref} />
                break;
        case "country":
            inputComponent = <CountryInput label={label} type="text" id={id} small={small} required={required} ref={ref} activeCountry={inputData.activeCountry} setActiveCountry={inputData.setActiveCountry} /> 
                break;
        default:
            inputComponent = <TextInput label={label} type={type} id={id} small={small} required={required} ref={ref} />
                break;
    }

    return(
        <div className={`${styles.registerDetail} ${className}`}>
            {inputComponent}
        </div>
    )
}
