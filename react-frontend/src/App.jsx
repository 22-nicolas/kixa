import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "./pages/Index.jsx"
import Search from "./pages/Search.jsx"
import Item from "./pages/Item.jsx"

import "./styles/general.css"



function App() {
  return (
    <Router basename="/kixa">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<Search />} />
        <Route path="/item" element={<Item />} />
      </Routes>
    </Router>
  )
}

export default App
