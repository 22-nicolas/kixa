import { createContext, useContext, useEffect, useRef, useState } from "react";
import { suscribeToAccountBtn, unSuscribe } from "../../../modules/AccountBtnEvent";
import { isDescandentOf } from "../../../modules/utils";
import { supportedCountries, getUserRegionName} from "../../../modules/utils"
import Default from "./Default";
import Register from "./Register";
import Login from "./Login";


export const InterfaceContext = createContext()
export const HighlightedFieldsContext = createContext()
export const ActiveCountryContext = createContext()

export default function AccountPopup() {
    const loginPopup = useRef(null)

    const [isOpen, setIsOpen] = useState(false)
    const [currentInterface, setInterface] = useState('default')
    const [highlightedFields, setHighlightedFields] = useState([])
    const userRegionName = getUserRegionName() //get userRegion to set as default prefix
    const [activeCountry, setActiveCountry] = useState(userRegionName || supportedCountries[0]) //default back to first supported country (france)
    
    //link/disconnect toggleIsOpen to account btn
    useEffect(() => {
        suscribeToAccountBtn(toggleIsOpen);
        return () => unSuscribe(toggleIsOpen)
    }, []);
    
    //check if isOpen and clicked outside the popup
    useEffect(() => {
        let controller = new AbortController
        window.addEventListener('mousedown', (event) => {
            if(!isOpen) {
                controller.abort()
                return
            }
            if (!(isDescandentOf(event.target, loginPopup.current) || isDescandentOf(event.target, document.querySelector('.account-btn')))) {
                setIsOpen(prev => false) //if so close
                setInterface('default')
                controller.abort() //clean up listener
            }
        }, { signal: controller.signal });
    }, [isOpen]);
    
    function toggleIsOpen() {
        setIsOpen(prev => {
            if(!prev) {
                setInterface('default')
            }
            return !prev
        });
    }

    return(
        <div className={`account-popup${isOpen ? " show" : ""}`} ref={loginPopup}>
            <ActiveCountryContext.Provider value={[activeCountry, setActiveCountry]}>
                <HighlightedFieldsContext.Provider value={[highlightedFields, setHighlightedFields]}>
                    <InterfaceContext.Provider value={[currentInterface, setInterface]}>
                        <Default/>
                        <Register/>
                        <Login/>
                    </InterfaceContext.Provider>
                </HighlightedFieldsContext.Provider>
            </ActiveCountryContext.Provider>
        </div>
    );
}

export function getIsVisible(interfaceId) {
    const [currentInterface, setInterface] = useContext(InterfaceContext)
    const isVisible = currentInterface === interfaceId
    return {isVisible, currentInterface, setInterface}
}