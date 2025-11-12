import { useEffect, useRef, useState } from "react";
import { suscribeToAccountBtn } from "./modules/AccountBtnEvent";
import { isDescandentOf } from "./modules/utils";
import './styles/general.css'


function LoginPopup() {
    const loginPopup = useRef(null)

    const [isOpen, setIsOpen] = useState(false)
    const [interfaceType, setInterfaceType] = useState('default')
    
    useEffect(() => {
        suscribeToAccountBtn(toggleIsOpen);
    }, []);

    useEffect(() => {
        let controller = new AbortController
        window.addEventListener('mousedown', (event) => {
            if(!isOpen) {
                controller.abort()
                return
            }
            if (!(isDescandentOf(event.target, loginPopup.current) || isDescandentOf(event.target, document.querySelector('.account-btn')))) {
                toggleIsOpen(false)
                controller.abort()
            }
        }, { signal: controller.signal });
    }, [isOpen]);

    let CurrentInterface = getInterfaceFromType();
    
    function toggleIsOpen(setState) {
        if (setState) {
            setIsOpen(setState)
            return
        }

        setIsOpen(prev => {
            const next = !prev;
            return next;
        });
    }

    return(
        <div className={`login-popup${isOpen ? " show" : ""}`} ref={loginPopup}>
            <CurrentInterface setInterfaceType={setInterfaceType} />
        </div>
    );
}

function Default({ setInterfaceType }) {

    return(
        <div className="default">
            <div className="register-btn" onMouseDown={() => setInterfaceType('register')}><p>register</p></div>
            <div className="separator">
                <div className="line"></div>
                <span>or</span>
                <div className="line"></div>
            </div>
            <div className="login-btn" onMouseDown={() => setInterfaceType('login')}><p>login</p></div>
        </div>
    )
}

function getInterfaceFromType(interfaceType) {
    switch (interfaceType) {
        case "register":
            //CurrentInterface = Register;
            //break;
        case "login":
            //CurrentInterface = Login;
            //break;
        default:
            return Default;
    }
}

export default LoginPopup