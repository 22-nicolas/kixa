import logo from "../../assets/PayPal.png"

export default function PayPalBtn({ className, onClick }) {
    return (
        <div className={`btn btn-warning paypalBtn ${className || ""}`} onClick={onClick}>
            <img className="paypalLogo" src={logo} alt="PayPal" />
        </div>
    )
}