import { createContext, useState } from "react"
import { getIsVisible } from "./AccountPopup"

export const HighlightedFieldsContext = createContext()

export default function Login() {
    const {isVisible} = getIsVisible('login')
    const [highlightedFields, setHighlightedFields] = useState([])

    return(
        <HighlightedFieldsContext.Provider value={highlightedFields}>
            <div className={`login ${isVisible ? "" : "hidden"}`}>login</div>
        </HighlightedFieldsContext.Provider>
    )
}