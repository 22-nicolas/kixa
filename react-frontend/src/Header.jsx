import './styles/general.css'
import './styles/header.css'

//images
import logo from './assets/logo.png'
import search_icon from './assets/search_icon.png'
import cart_icon from './assets/cart_icon.png'
import user_icon from './assets/user_icon.png'

function Header() {
    return(
        <div className="header">
            <a href="index.html"><img src={logo} alt="logo" /></a>
            <div className="right-header">
                <div className="search-div">
                    <img src={search_icon} alt="search icon" />
                    <input type="text" id="searchbar" enterkeyhint="search" />
                </div>
                <a href="cart.html">
                    <p>0</p>
                    <img src={cart_icon} alt="cart icon" />
                </a>
                <div className="account-btn">
                    <img src={user_icon} alt="user icon" />
                </div>
            </div>
        </div>
    );
}

export default Header;