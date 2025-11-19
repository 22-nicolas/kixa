import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "./pages/Index.jsx"

import "./styles/general.css"

function App() {
  return (
    <Router basename="/kixa">
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </Router>
  )
}

export default App
