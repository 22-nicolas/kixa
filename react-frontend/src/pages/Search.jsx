import { useEffect } from "react"
import Footer from "../elements/general/Footer"
import Header from "../elements/general/Header"
import LoginPopup from "../elements/general/LoginPopup"
import "../styles/search.css"

function Search() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const searchText = params.get("searchText")
        const searchbar = document.getElementById("searchbar")
        
        searchbar.value = searchText
    }, [])

    return(
        <>
            <Header/>
            <LoginPopup/>



            <Footer/>
        </>
    )
}

export default Search