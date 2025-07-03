
import { Route, Routes } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import AllBooks from './pages/AllBooks';
import ContactUs from './pages/ContactUs';
import Home from "./pages/Home";
import MainBooks from './pages/MainBooks';
import PageNotFound from './pages/PageNotFound';
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
      <Route path='/contactus' element={<ContactUs/>}/>
      <Route path='/aboutus' element={<AboutUs/>} />
      <Route path='/profilesettings' element={<ProfileSettings /> }/>
    </Routes>
  )
}

export default App