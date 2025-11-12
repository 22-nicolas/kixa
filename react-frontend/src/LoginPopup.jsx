import { useEffect, useRef, useState } from "react";
import { suscribeToAccountBtn } from "./modules/AccountBtnEvent";
import { isDescandentOf } from "./modules/utils";
import './styles/general.css'


function LoginPopup() {
    const loginPopup = useRef(null)

    const [isOpen, setIsOpen] = useState(false)
    const [interfaceType, setInterfaceType] = useState('default')


    
    useEffect(() => {
        let controller = new AbortController
        window.addEventListener('mousedown', (event) => {
            if(!isOpen) {
                controller.abort()
                return
            }
            console.log(loginPopup.current)
            if (!(isDescandentOf(event.target, loginPopup.current) || isDescandentOf(event.target, document.querySelector('.account-btn')))) {
                console.log("fired")
                toggleIsOpen(false)
                controller.abort()
                return
            }
        }, { signal: controller.signal });
    }, [isOpen]);

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

    useEffect(() => {
        suscribeToAccountBtn(toggleIsOpen);
    }, []);

    let CurrentInterface;
    switch (interfaceType) {
        case "register":
            //CurrentInterface = Register;
            //break;
        case "login":
            //CurrentInterface = Login;
            //break;
        default:
            CurrentInterface = Default;
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

export default LoginPopup