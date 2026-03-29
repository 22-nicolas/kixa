import '../../styles/header.css'
import PropTypes from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { fireAccountBtnEvent } from '../../modules/AccountBtnEvent.js'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import { useCart } from '../../customHooks/CartProvider.jsx'
import { CurrencyContext, SupportedCurrencies } from '../../customHooks/CurrencyProvider.jsx'

//images
import logo from '../../assets/logo.png'
import cart_icon from '../../assets/cart_icon.png'
import user_icon from '../../assets/user_icon.png'


function Header() {    
    const {cart, getQuantity} = useCart()
    const [quantity, setQuantity] = useState(0)
    const {currency, setCurrency} = useContext(CurrencyContext)
    const currencies = SupportedCurrencies.map((cur) => (
        <li key={cur}>
            <button className="dropdown-item" type="button" onClick={() => setCurrency(cur)}>{cur}</button>
        </li>
    ))

    //update cart quantity display
    useEffect(() => {
        setQuantity(getQuantity())
    }, [cart])

    return(
        <nav className="header navbar navbar-expand-lg">
            <Link to="/" className='navbar-brand'><img src={logo} alt="logo" /></Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className='collapse navbar-collapse justify-content-between' id="navbarNavDropdown">
                <div className='d-flex align-items-start flex-column flex-lg-row'>
                    <Link to="/" className='btn'>Women</Link>
                    <Link to="/" className='btn'>Men</Link>
                    <Link to="/" className='btn'>Kids</Link>
                    <Link to="/" className='btn'>Offers</Link>
                </div>
                <div className="right-header justify-content-start" role="search">
                    <SearchBar/>

                    {/* Cart button */}
                    <Link to="/cart">
                        <p>{quantity}</p>
                        <img src={cart_icon} alt="cart icon" />
                    </Link>

                    {/* Currency dropdown */}
                    <div className='dropdown'>
                        <button className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {currency}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            {currencies}
                        </ul>
                    </div>

                    {/* Account button */}
                    <div onMouseDown={fireAccountBtnEvent} className="account-btn">
                        <img src={user_icon} alt="user icon" />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;