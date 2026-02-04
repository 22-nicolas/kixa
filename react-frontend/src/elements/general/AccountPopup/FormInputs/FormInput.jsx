import { createRef } from "react"
import PasswordInput from "./PasswordInput"
import PhoneNumberInput from "./PhoneNumberInput"
import TextInput from "./TextInput"
import styles from "../../../../styles/register.module.css"

export default function FormInput({ inputData, inputRefs }) {

    const inputComponent = inputData.map((data, i) => {
        let {label, id, small, type, required} = data

        if (!id) id = label.toLocaleLowerCase().replaceAll(" ", "_")
        if (!type) type = "text"
        if (required === undefined) required = true

        const ref = createRef();
        inputRefs.current[id] = ref;

        switch (type) {
            case "phone number":
                return <PhoneNumberInput key={i} label={label} id={id} small={small} i={i} ref={ref} />
            case "password":
                return <PasswordInput key={i} label={label} id={id} small={small} i={i} ref={ref} />
            default:
                return <TextInput key={i} label={label} type={type} id={id} small={small} i={i} required={required} ref={ref} />
        }
        
    })

    return(
        <div className={`${styles.registerDetail}`}>
            {inputComponent}
        </div>
    )
}
