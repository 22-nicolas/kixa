import { Link } from "react-router-dom";
import "../../styles/footer.css"

export default function Footer() {
    return(
        <footer>
            {/*
            <input type="checkbox" className="currency-button" id="check"/>
            <label for="check">
                <img src="imgs/world_icon.png"/>
                <p>Currency $</p>
            </label>
            <div className="currency-window">
            
            </div>
            */}
            <div className="links">
                <Link>Terms of Sale</Link>
                <Link>Terms of Use</Link>
                <Link>Help</Link>
            </div>
            <p>© 2025 KIXA All rights reserved.</p>
        </footer>
    )
}