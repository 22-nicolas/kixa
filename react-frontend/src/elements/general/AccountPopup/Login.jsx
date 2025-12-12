import { getIsVisible } from "./AccountPopup"

export default function Login() {
    const {isVisible} = getIsVisible('login')

    return <div className={`login ${isVisible ? "" : "hidden"}`}>login</div>
}