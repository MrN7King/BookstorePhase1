// src/pages/CartPage.jsx
import Navigation from '@/sections/Navigation';
import CartComponent from '@/sections/CartComponent';
import { FooterWithSitemap } from '../sections/Footer';

const CartPage = () => {
  return (
    <>
      <div className='container mx-auto pt-8 overflow-hidden'>
        <Navigation />
      </div>
      <div className='mt-8'>
        <CartComponent />
      </div>
      <FooterWithSitemap/>
    </>
  )
}

export default CartPage;