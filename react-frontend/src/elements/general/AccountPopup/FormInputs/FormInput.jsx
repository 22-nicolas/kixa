import { createRef } from "react"
import PasswordInput from "./PasswordInput"
import PhoneNumberInput from "./PhoneNumberInput"
import TextInput from "./TextInput"
import styles from "../../../../styles/register.module.css"
import CountryInput from "./CountryInput"

export default function FormInput({ className, inputData, highlightedFields, inputRefs }) {
    let {label, id, small, type, required} = inputData

    if (!id) id = label?.toLocaleLowerCase().replaceAll(" ", "_")
    if (!type) type = "text"
    if (required === undefined) required = true

    inputData = {
        ...inputData,
        label,
        id,
        small,
        type,
        required
    }

    const ref = createRef();
    inputRefs.current[id] = ref;

    let inputComponent;

    switch (type) {
        case "phone number":
            inputComponent = <PhoneNumberInput inputData={inputData} ref={ref} highlightedFields={highlightedFields} />
                break;
        case "password":
            inputComponent = <PasswordInput inputData={inputData} ref={ref} highlightedFields={highlightedFields} />
                break;
        case "country":
            inputComponent = <CountryInput inputData={inputData} ref={ref} highlightedFields={highlightedFields} activeCountry={inputData.activeCountry} setActiveCountry={inputData.setActiveCountry} /> 
                break;
        default:
            inputComponent = <TextInput inputData={inputData} ref={ref} highlightedFields={highlightedFields} />
                break;
    }

    return(
        <div className={`${styles.registerDetail} ${className}`}>
            {inputComponent}
        </div>
    )
}
