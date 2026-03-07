import { useContext } from "react"
import { InterfaceContext, HighlightedFieldsContext } from "../AccountPopup"
import styles from "../../../../styles/register.module.css"


export default function TextInput({label, id, small, i, type, required, ref }) {
    const [highlightedFields] = useContext(HighlightedFieldsContext)

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