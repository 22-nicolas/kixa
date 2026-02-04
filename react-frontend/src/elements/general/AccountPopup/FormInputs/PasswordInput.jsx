import { useContext, useState } from "react"
import { InterfaceContext } from "../AccountPopup"
import styles from "../../../../styles/register.module.css"
import openEye from "../../../../assets/open_eye.png"
import closedEye from "../../../../assets/closed_eye.png"
import { HighlightedFieldsContext } from "../AccountPopup"

export default function PasswordInput({label, id, small, i, ref }) {
    const [isVisible, setIsVisible] = useState(false)
    const [currentInterface] = useContext(InterfaceContext)
    const [highlightedFields] = useContext(HighlightedFieldsContext)


    const isHighlightedFields = highlightedFields.includes(id)

    function toggleVisible() {
        setIsVisible(prev => !prev)
    }

    return(
        <div style={{ ...(i !== 2 && { marginRight: '4ch' }) }}>
            <label htmlFor={id} className={styles.inputLabel}>{label} *</label>
            <div 
                className={styles.password} 
                style={{ ...(isHighlightedFields && { borderColor: 'red' }) }}
            >
                <input ref={ref} id={id} type={`${isVisible ? "text" : "password"}`} className={`${styles.passwordInput} ${small ? styles.smallInput : ""}`} />
                <img onMouseDown={toggleVisible} src={`${isVisible ? closedEye : openEye}`} alt="toggle visible" />
            </div>
        </div>
    )  
}