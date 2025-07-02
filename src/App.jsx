import { Route, Routes } from 'react-router-dom';
import AllBooks from './pages/AllBooks';
import Home from "./pages/Home";
import LoginPage from './pages/LoginPage';
import MainBooks from './pages/MainBooks';
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
      <Route path="/sign-in" element={<LoginPage/>}  /> {/* Add more routes here as needed */}
    </Routes>
  )
}

export default App