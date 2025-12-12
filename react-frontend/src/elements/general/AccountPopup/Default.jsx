import { getIsVisible } from "./AccountPopup"

export default function Default() {
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