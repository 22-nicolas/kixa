import { getIsVisible } from "./AccountPopup"

export default function Register() {
    const {isVisible} = getIsVisible('register')

    return <div className={`register ${isVisible ? "" : "hidden"}`}>register</div>
}