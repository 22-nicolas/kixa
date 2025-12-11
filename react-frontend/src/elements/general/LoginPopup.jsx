import { createContext, useContext, useEffect, useRef, useState } from "react";
import { suscribeToAccountBtn, unSuscribe } from "../../modules/AccountBtnEvent";
import { isDescandentOf } from "../../modules/utils";

const InterfaceContext = createContext()

function LoginPopup() {
    const loginPopup = useRef(null)

    const [isOpen, setIsOpen] = useState(false)
    const [currentInterface, setInterface] = useState('default')
    
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
        <div className={`login-popup${isOpen ? " show" : ""}`} ref={loginPopup}>
            <InterfaceContext.Provider value={[currentInterface, setInterface]}>
                <Default/>
                <Register/>
                <Login/>
            </InterfaceContext.Provider>
        </div>
    );
}

function Default() {
    const {isVisible, setInterface} = getIsVisible('default')

    return(
        <div className={`${isVisible ? "" : "hidden"}`}>
            <div className="register-btn" onMouseDown={() => setInterface('register')}><p>register</p></div>
            <div className="separator">
                <div className="line"></div>
                <span>or</span>
                <div className="line"></div>
            </div>
            <div className="login-btn" onMouseDown={() => setInterface('login')}><p>login</p></div>
        </div>
    )
}

function Register() {
    const {isVisible} = getIsVisible('register')

    return <div className={`register ${isVisible ? "" : "hidden"}`}>register</div>
}

function Login() {
    const {isVisible} = getIsVisible('login')

    return <div className={`login ${isVisible ? "" : "hidden"}`}>login</div>
}

function getIsVisible(interfaceId) {
    const [currentInterface, setInterface] = useContext(InterfaceContext)
    const isVisible = currentInterface === interfaceId
    return {isVisible, currentInterface, setInterface}
}

export default LoginPopup