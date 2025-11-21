import { useRef } from 'react'
import search_icon from '../../assets/search_icon.png'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
    const searchbar = useRef()
    const navigate = useNavigate();
    
    function handleKey(e) {
        if (e.key !== "Enter") return
        const params = new URLSearchParams(window.location.search)
        params.set("searchText", searchbar.current.value) 
        
        //if user is on search.html additional filters get passed
        if (window.location.pathname.includes("search")) {
            // TODO: pass additional filters 
        }
        

        navigate("/search?" + params)
    }

    return(
        <div className="search-div">
            <img src={search_icon} alt="search icon" />
            <input onKeyDown={handleKey} ref={searchbar} type="text" id="searchbar" enterKeyHint="search" />
        </div>
    )
}