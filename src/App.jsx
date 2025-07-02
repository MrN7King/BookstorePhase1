import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import MainBooks from './pages/MainBooks';
import AllBooks from './pages/AllBooks';
import PageNotFound from './pages/PageNotFound';
import ProductPage from './pages/ProductPage';  

const App = () => {
  return (
    <Routes>
      <Route path={"/"} element={<Home />} />
      <Route path="*" element={<PageNotFound/>} />
      <Route path='/P2' element={<MainBooks/>} />    {/* Add more routes here as needed */}
      <Route path='/AllBooks' element={<AllBooks/>} />
      <Route path='/ProductInfo' element={<ProductPage/>}/>
      {/* Add more routes here as needed */}
    </Routes>
  )
}

export default App