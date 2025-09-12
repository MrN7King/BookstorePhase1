//file: frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import AboutUs from './pages/AboutUs';
import AdminMainPage from './pages/admin/adminPages/AdminMainPage.tsx'; // Importing the AdminDashboard component
import AllBooks from './pages/AllBooks';
import AllPremiumAccounts from './pages/AllPremiumAccounts'; // Importing the AllPremiumAccounts component
import CartPage from './pages/CartPage'; // Importing the ShoppingPage component
import CheckoutDetailsPage from './pages/CheckoutDetailsPage';
import ContactUs from './pages/ContactUs';
import GenreSpecificPage from './pages/GenreSpecificPage';
import Home from "./pages/Home";
import MainBooks from './pages/MainBooks';
import PageNotFound from './pages/PageNotFound';
import PaymentPage from './pages/PaymentPage'; // Importing the PaymentPage component
import PremiumProductPage from './pages/PremiumProductPage'; // Importing the PremiumProductPage component
import ProductPage from './pages/ProductPage';
import ProfileSettings from './pages/ProfileSettings';
import ThankYouPage from './pages/ThankYouPage.jsx';

import { CartProvider } from './context/CartContext';
import { MiniCartProvider } from './context/MiniCartContext';
import { CheckoutProvider } from './context/CheckoutContext';


const App = () => {
  return (
    <>
      {/* Wrap your entire app with MiniCartProvider */}
      <CartProvider>
        <MiniCartProvider>
          <CheckoutProvider>
            <ScrollToTop />
            <Routes>

            <Route path={"/"} element={<Home />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path='/Books' element={<MainBooks />} />    {/* Add more routes here as needed */}
            <Route path='/AllBooks' element={<AllBooks />} />
            <Route path='/ProductInfo' element={<ProductPage />} />
            <Route path='/GenreSpecific' element={<GenreSpecificPage />} />
            {/* Shopping Page Route */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/Cart" element={<CartPage />} /> {/* Handle both routes */}
            <Route path="/checkout" element={<CheckoutDetailsPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            {/* Add more routes here as needed */}
            <Route path='/contactus' element={<ContactUs />} />
            <Route path='/aboutus' element={<AboutUs />} />
            <Route path='/profilesettings' element={<ProfileSettings />} />
            <Route path="/product/:bookId/:bookSlug?" element={<ProductPage />} />
            {/* Premium Accounts Routes */}
            {/* Route for the main listing of all premium accounts */}
            <Route path='/premium-accounts' element={<AllPremiumAccounts />} />
            <Route path="/premium-product/:id/:slug?" element={<PremiumProductPage />} />


            {/* Admin pages */}
            <Route path='/AllPremiumAccounts' element={<AllPremiumAccounts />} />
            <Route path='/admin/*' element={<AdminMainPage />} />
          </Routes>
          </CheckoutProvider>
        </MiniCartProvider>
      </CartProvider>
    </>
  )
}

export default App