import { useRef, useEffect } from 'react'
import search_icon from '../../assets/search_icon.png'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function SearchBar() {
    const searchbar = useRef()
    const navigate = useNavigate();
    const [params] = useSearchParams()
    
    useEffect(reapplySearchText, [])

    function reapplySearchText() {
        const searchText = params.get("searchText")
        
        searchbar.current.value = searchText
    }
    
    function search() {
        params.set("searchText", searchbar.current.value) 

        navigate("/search?" + params)
    }

    function handleKey(e) {
        if (window.location.pathname.includes("search")) {
            search()
        } else {
            if (e.key !== "Enter") return
            search() 
        }
        
    }

    return(
        <div className="search-div">
            <img src={search_icon} alt="search icon" />
            <input onKeyUp={handleKey} ref={searchbar} type="text" id="searchbar" enterKeyHint="search" />
        </div>
    )
}