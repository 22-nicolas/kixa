import { useContext } from "react"
import { HighlightedFieldsContext } from "../AccountPopup"
import { InterfaceContext } from "../AccountPopup"
import styles from "../../../../styles/register.module.css"


export default function TextInput({label, id, small, i, type, required, ref }) {
    const [currentInterface] = useContext(InterfaceContext)
    const [highlightedFields] = useContext(HighlightedFieldsContext)

    //console.log({highlightedRegisterFields: highlightedRegisterFields, highlightedLoginFields: highlightedLoginFields})

    const isHighlightedFields = highlightedFields.includes(id);

    return(
        <div style={{ ...(i !== 2 && { marginRight: '4ch' }) }}>
            <label htmlFor={id} className={styles.inputLabel}>{label}{required ? " *" : ""}</label>
            <input ref={ref} id={id} type={type} 
                   className={`${styles.input} ${small ? styles.smallInput : ""}`} 
                   style={{ ...(isHighlightedFields && { borderColor: 'red' }) }} />
        </div>
    )  
}