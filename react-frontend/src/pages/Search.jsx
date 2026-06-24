import { useEffect , useState} from "react"
import { useSearchParams } from "react-router-dom"
import Footer from "../elements/general/Footer"
import Header from "../elements/general/Header"
import LoginPopup from "../elements/general/AccountPopup/AccountPopup"
import Container from "../elements/general/Container"
import Pricing from "../elements/search/Pricing"
import Color from "../elements/search/Color"
import Brand from "../elements/search/Brand"
import Item from "../elements/search/Item"
import { Colors } from "../modules/colors"
import { Brands } from "../modules/brands"
import { getProductData } from "../api/productData"
import { matchesSearchText } from "../modules/searchMatcher"
import styles from "../styles/search.module.css"

function Search() {
    const [searchParams] = useSearchParams()
    const [itemsData, setItemsData] = useState([])
    const searchText = searchParams.get("searchText") || ""
    const hasSearchText = searchText.trim().length > 0
    let searchResultsCount = 0
    const items = getItemsToShow()
    
    useEffect(() => {
        getItems()
    }, [])

    async function getItems() {
        const itemsData = await getProductData()
        setItemsData(itemsData)
    }

    function getItemsToShow() {
        if (!hasSearchText) {
            return itemsData.map(itemData => <Item key={itemData.id} itemData={itemData}/>)
        }

        const matchingItems = []
        const otherItems = []

        for (const itemData of itemsData) {
            if (matchesSearchText(itemData.name, searchText)) {
                searchResultsCount++
                matchingItems.push(itemData)
            } else {
                otherItems.push(itemData)
            }
        }

        const itemsToShow = matchingItems.map(itemData => <Item key={itemData.id} itemData={itemData}/>)

        if (otherItems.length > 0) {
            itemsToShow.push(
                <div key="other-products-separator" className={`${styles.searchSeparator} col-12`}>
                    <span>Other products</span>
                </div>
            )
        }

        return [
            ...itemsToShow,
            ...otherItems.map(itemData => <Item key={itemData.id} itemData={itemData} ignoreSearchText/>)
        ]
    }

    console.log(searchResultsCount)
    return(
        <>
            <Header/>
            <LoginPopup/>

            <Container>
                <div className={styles.searchUi}>
                    <div className={`${styles.filters} collapse d-xl-block`} id="filtersTogglerButton">
                        <Pricing/>
                        <Color colors={Colors}/>
                        <Brand brands={Brands} />
                    </div>
                    <div>
                        <div className={`${styles.itemHeader} btn d-inline-block mb-3`}>
                            <button className="navbar-toggler d-xl-none" type="button" data-bs-toggle="collapse" data-bs-target="#filtersTogglerButton" aria-controls="filtersTogglerButton" aria-expanded="false" aria-label="Toggle filters">
                                Filters
                            </button>
                        </div>
                        <div className={` row`}>
                            {searchResultsCount === 0 && hasSearchText ? <div className={`${styles.noMatches} col-12`}>No products found for: "{searchText}"</div> : null}
                            {items}
                        </div>
                    </div>
                </div>
            </Container>
            

            <Footer/>
        </>
    )
}

export default Search
