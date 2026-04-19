import Header from "../elements/general/Header";
import LoginPopup from "../elements/general/AccountPopup/AccountPopup"
import Footer from "../elements/general/Footer"
import Container from "../elements/general/Container";
import { useCart } from "../customHooks/CartProvider";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import successCheck from "../assets/success_check.png"

import styles from "../styles/success.module.css"
import { getBaseApiUrl } from "../modules/utils";

export default function Success() {
    const {clearCart} = useCart()
    const [searchParams] = useSearchParams();

    useEffect(() => {
        clearCart()
        capturePayPalPayment();
    }, [])

    async function capturePayPalPayment() {
        const orderToken = searchParams.get("token");
        if (!orderToken) return
        const API_BASE_URL = getBaseApiUrl();
        fetch(`${API_BASE_URL}/checkout/success/paypal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({orderToken: orderToken})
        })
    }

    return(
        <>
            <Header/>
            <LoginPopup/>

                <Container>
                    <div className={styles.successContainer}>
                        <h1 className="text-center">Payment successful!</h1>
                        <img className={styles.successImg} src={successCheck} alt="Success check" />
                        <p>Thank you for your purchase. Your order is being processed and will be shipped to you soon.</p>
                        <Link className={`${styles.backToHomeBtn} btn btn-success`} to="/">Back to Homepage</Link>
                    </div>
                </Container>

            <Footer/>
        </>
    )
}