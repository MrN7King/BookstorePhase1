import { FooterWithSitemap } from "@/sections/Footer";
import Navigation from "@/sections/Navigation";
import ProductDetails from "@/sections/productDetails";

const ProductPage = () => {
  return (
    <>
    <div className='container mx-auto pt-16 overflow-hidden'>
     <Navigation /></div>
     <ProductDetails />
     
     <div className="pt-20">  <FooterWithSitemap /></div>
    </>
  )
}

export default ProductPage