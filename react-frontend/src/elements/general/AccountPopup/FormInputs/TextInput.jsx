import { useContext } from "react"
import { InterfaceContext,  } from "../AccountPopup"
import styles from "../../../../styles/register.module.css"


export default function TextInput({ inputData, ref, highlightedFields }) {
    const {label, id, small, type, required} = inputData
    const isHighlightedFields = highlightedFields.includes(id);

    return(
        <div>
            <label htmlFor={id} className={styles.inputLabel}>{label}{required ? " *" : ""}</label>
            <input ref={ref} id={id} type={type} 
                   className={`${styles.input} ${small ? styles.smallInput : ""}`} 
                   style={{ ...(isHighlightedFields && { borderColor: 'red' }) }} />
        </div>
    )  
}