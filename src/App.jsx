import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import LoginPage from './pages/LoginPage';
import MainBooks from './pages/MainBooks';

const App = () => {
  return (
    <Routes>
      <Route path={"/"} element={<Home />} />
      <Route path="*" element={<h2>404 Page Not Found</h2>} />
      <Route path='/P2' element={<MainBooks/>} /> 
      <Route path="/sign-in" element={<LoginPage/>}  /> {/* Add more routes here as needed */}
    </Routes>
  )
}

export default App