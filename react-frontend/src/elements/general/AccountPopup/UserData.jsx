import { useContext, useState, useEffect } from "react"
import { InterfaceContext } from "./AccountPopup"
import user_icon from '../../../assets/user_icon.png'

export default function UserData({userData}) {
    const [currentInterface] = useContext(InterfaceContext)
    const [isVisible, setIsVisible] = useState(currentInterface === "userData")

    useEffect(() => {
        setIsVisible(currentInterface === "userData")
        if (currentInterface === "userData") {

        } else {

        }
    }, [currentInterface])



    return(
        <div className={`${isVisible ? "" : "hidden"}`}>
            <p>Welcome!</p>
            <div className="row">
                <div className="col-4 d-flex align-center justify-center">
                    <img className="user-icon" src={user_icon} alt="user icon"/>
                </div>
                <div className="col-8">
                    <p>{userData.first_name} {userData.last_name}</p>
                    <p>{userData.email}</p>
                </div>
            </div>
        </div>
    )
}