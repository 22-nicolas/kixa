import { useContext, useState } from "react"
import { InterfaceContext } from "../AccountPopup"
import styles from "../../../../styles/register.module.css"
import openEye from "../../../../assets/open_eye.png"
import closedEye from "../../../../assets/closed_eye.png"
import {  } from "../AccountPopup"

export default function PasswordInput({inputData, ref, highlightedFields }) {
    const [isVisible, setIsVisible] = useState(false)
    const [currentInterface] = useContext(InterfaceContext)

    const {label, id, small, type, required} = inputData
    const isHighlightedFields = highlightedFields.includes(id)

    function toggleVisible() {
        setIsVisible(prev => !prev)
    }

    return(
        <div>
            <label htmlFor={id} className={styles.inputLabel}>{label}{required ? " *" : ""}</label>
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