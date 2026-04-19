import logo from "../../assets/paypal.png"

export default function PayPalBtn({ className, onClick }) {
    return (
        <div className={`btn btn-warning paypalBtn ${className || ""}`} onClick={onClick}>
            <img className="paypalLogo" src={logo} alt="PayPal" />
        </div>
    )
}