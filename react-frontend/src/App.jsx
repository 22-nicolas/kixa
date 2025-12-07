import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "./pages/Index.jsx"
import Search from "./pages/Search.jsx"
import Item from "./pages/Item.jsx"

import "./styles/general.css"
import { createContext } from "react"
import CartProvider from "./customHooks/CartProvider.jsx"

export const CartContext = createContext()

function App() {
  
  
  return (
    <CartProvider>
      <Router basename="/kixa">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/item" element={<Item />} />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App
