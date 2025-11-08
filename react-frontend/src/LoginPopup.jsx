import { useEffect, useState } from "react";
import { suscribeToAccountBtn } from "./modules/AccountBtnEvent";
import './styles/general.css'


function LoginPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [interfaceType, setInterfaceType] = useState('default')

    function toggleIsOpen() {
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
        <div className={`login-popup${isOpen ? " show" : ""}`}>
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