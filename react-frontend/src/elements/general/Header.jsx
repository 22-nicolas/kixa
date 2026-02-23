import '../../styles/header.css'
import PropTypes from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { fireAccountBtnEvent } from '../../modules/AccountBtnEvent.js'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import { useCart } from '../../customHooks/CartProvider.jsx'
import { CartContext } from '../../App.jsx'

//images
import logo from '../../assets/logo.png'
import cart_icon from '../../assets/cart_icon.png'
import user_icon from '../../assets/user_icon.png'


function Header() {
    //copy and pasted just as placeholders
    const LinkDropdownsList = ['Women', 'Men', 'Kids', 'Offers']

    const LinkDropdownElements = LinkDropdownsList.map((txt) => {
        return <Link className='btn'>{txt}</Link>
    });

    
    const {cart, getQuantity} = useCart()
    const [quantity, setQuantity] = useState(0)
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
                    {LinkDropdownElements}
                </div>
                <div className="right-header justify-content-start" role="search">
                    <SearchBar/>
                    <Link to="/cart">
                        <p>{quantity}</p>
                        <img src={cart_icon} alt="cart icon" />
                    </Link>
                    <div onMouseDown={fireAccountBtnEvent} className="account-btn">
                        <img src={user_icon} alt="user icon" />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;