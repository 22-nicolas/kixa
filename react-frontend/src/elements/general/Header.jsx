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
    const LinkDropdownsList = Object.entries({
        Women: [
            {title: "Shoes", links: ["Running", "Hiking", "Skating"]},
            {title: "Accesories", links: ["Hats", "Bags"]}
        ],
        Men: [
            {title: "Shoes", links: ["Running", "Hiking", "Skating"]},
            {title: "Accesories", links: ["Hats", "Bags"]}    
        ],
        Kids: [
            {title: "Shoes", links: ["Running", "Hiking", "Skating"]},
            {title: "Accesories", links: ["Hats", "Bags"]}    
        ],
        Offers: [
            {title: "Shoes", links: ["Running", "Hiking", "Skating"]},
            {title: "Accesories", links: ["Hats", "Bags"]}    
        ]
    })

    const LinkDropdownElements = LinkDropdownsList.map(([key, categories]) => {
    return (
            <LinkDropdown
                key={key}
                title={key}
                categories={categories}
            />
        );
    });

    
    const {cart, getQuantity} = useCart()
    const [quantity, setQuantity] = useState(0)
    //update cart quantity display
    useEffect(() => {
        setQuantity(getQuantity())
    }, [cart])

    return(
        <div className="header">
            <Link to="/"><img src={logo} alt="logo" /></Link>
            <div className='header-links-container'>
                {LinkDropdownElements}
            </div>
            <div className="right-header">
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
    );
}

export default Header;

function LinkDropdown({title, categories}) {
    const [isOpen, setIsOpen] = useState(false)

    const dropdownElements = mapCategories(categories);

    return(
        <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <a className="header-link"><p>{title}</p></a>
            <div className={`dropdown-menu${isOpen ? " show" : ""}`} id={title}>
                {dropdownElements}
            </div>
        </div>
    );
}
LinkDropdown.propTypes = {
    title: PropTypes.string,
    categories: PropTypes.array
}

function mapCategories(categories) {
    return categories.map((categorie) => {
        const categorieLinks = categorie.links.map(link => <a key={link}>{link}</a>)
        return(
            <div key={categorie.title}>
                <h1>{categorie.title}</h1>
                {categorieLinks}
            </div>
        );
    })
}