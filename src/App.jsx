import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<h2>404 Page Not Found</h2>} />
      {/* Add more routes here as needed */}
    </Routes>
  )
}

export default App