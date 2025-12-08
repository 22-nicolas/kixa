import Header from "../elements/general/Header";
import LoginPopup from "../elements/general/LoginPopup"
import Footer from "../elements/general/Footer"
import Container from "../elements/general/Container";
import CartList from "../elements/cart/CartList";
import Reciept from "../elements/cart/Reciept";

import styles from "../styles/cart.module.css"

export default function Cart() {
    return(
        <>
            <Header/>
            <LoginPopup/>

                <Container>
                    <h1>Shopping cart</h1>
                </Container>

                <Container>
                    <div className={styles.cart}>
                        <CartList/>
                        <Reciept/>
                    </div>
                </Container>

            <Footer/>
        </>
    )
}