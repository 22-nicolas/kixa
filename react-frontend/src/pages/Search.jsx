import { useEffect , useState} from "react"
import Footer from "../elements/general/Footer"
import Header from "../elements/general/Header"
import LoginPopup from "../elements/general/LoginPopup"
import Container from "../elements/general/Container"
import Pricing from "../elements/search/Pricing"
import Color from "../elements/search/Color"
import Brand from "../elements/search/Brand"
import Item from "../elements/search/Item"
import "../styles/search.css"
import { Colors } from "../modules/colors"
import { Brands } from "../modules/brands"
import { getProductData } from "../modules/api"

function Search() {
    const [itemsData, setItemsData] = useState([])
    const [items, setItems] = useState([])
    
    useEffect(() => {
        getItems()
    }, [])

    useEffect(() => {
        if (itemsData.length === 0) return
        setItems(itemsData.map(itemData => <Item key={itemData.id} itemData={itemData}/>))
    }, [itemsData])

    async function getItems() {
        const itemsData = await getProductData()
        setItemsData(itemsData)
    }

    return(
        <>
            <Header/>
            <LoginPopup/>

            <Container>
                <div className="search-ui">
                    <div className="filters">
                        <Pricing/>
                        <Color colors={Colors}/>
                        <Brand brands={Brands} />
                    </div>
                    <div>
                        <div className="item-header">

                        </div>
                        <div className="item-container">
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