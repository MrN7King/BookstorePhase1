import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import MainBooks from './pages/MainBooks';
import AllBooks from './pages/AllBooks';
import PageNotFound from './pages/PageNotFound';
import ProductPage from './pages/ProductPage';  
import GenreSpecificPage from './pages/GenreSpecificPage';
import CartPage from './pages/CartPage'; // Importing the ShoppingPage component
import CheckoutDetailsPage from './pages/CheckoutDetailsPage';
import PaymentPage from './pages/PaymentPage'; // Importing the PaymentPage component

const App = () => {
  return (
    <Routes>
      <Route path={"/"} element={<Home />} />
      <Route path="*" element={<PageNotFound/>} />
      <Route path='/P2' element={<MainBooks/>} />    {/* Add more routes here as needed */}
      <Route path='/AllBooks' element={<AllBooks/>} />
      <Route path='/ProductInfo' element={<ProductPage/>}/>
      <Route path='/GenreSpecific' element={<GenreSpecificPage/>}/>
      {/* Shopping Page Route */}
      <Route path="/cart" element={<CartPage/>} />
        <Route path="/checkout" element={<CheckoutDetailsPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      {/* Add more routes here as needed */}
    </Routes>
  )
}

export default App