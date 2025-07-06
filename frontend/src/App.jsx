import { Route, Routes } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import AllBooks from './pages/AllBooks';
import CartPage from './pages/CartPage'; // Importing the ShoppingPage component
import CheckoutDetailsPage from './pages/CheckoutDetailsPage';
import ContactUs from './pages/ContactUs';
import GenreSpecificPage from './pages/GenreSpecificPage';
import Home from "./pages/Home";
import MainBooks from './pages/MainBooks';
import PageNotFound from './pages/PageNotFound';
import PaymentPage from './pages/PaymentPage'; // Importing the PaymentPage component
import ProductPage from './pages/ProductPage';
import ProfileSettings from './pages/ProfileSettings';
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
      <Route path='/contactus' element={<ContactUs/>}/>
      <Route path='/aboutus' element={<AboutUs/>} />
      <Route path='/profilesettings' element={<ProfileSettings /> }/>
    </Routes>
  )
}

export default App