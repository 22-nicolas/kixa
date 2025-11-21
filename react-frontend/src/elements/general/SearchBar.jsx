import { useRef, useEffect } from 'react'
import search_icon from '../../assets/search_icon.png'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
    const searchbar = useRef()
    const navigate = useNavigate();
    
    useEffect(reapplySearchText, [])

    function reapplySearchText() {
        const params = new URLSearchParams(window.location.search)
        const searchText = params.get("searchText")
        
        searchbar.value = searchText
    }
    
    function search() {
        const params = new URLSearchParams(window.location.search)
        params.set("searchText", searchbar.current.value) 

        navigate("/search?" + params)
    }

    function handleKey(e) {
        if (e.key !== "Enter") return
        search()
    }

    return(
        <div className="search-div">
            <img src={search_icon} alt="search icon" />
            <input onKeyDown={handleKey} ref={searchbar} type="text" id="searchbar" enterKeyHint="search" />
        </div>
    )
}