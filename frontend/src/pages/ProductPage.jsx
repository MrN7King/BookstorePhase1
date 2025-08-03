import { useParams } from 'react-router-dom'; 
import { FooterWithSitemap } from "@/sections/Footer";
import Navigation from "@/sections/Navigation";
import ProductDetails from "@/sections/productDetails";

const ProductPage = () => {
  const { bookId, bookSlug } = useParams();
  return (
    <>
    <div className='container mx-auto pt-6 overflow-hidden'>
     <Navigation /></div>
     <ProductDetails bookId={bookId} bookSlug={bookSlug} /> 
     
     <div className="pt-20">  <FooterWithSitemap /></div>
    </>
  )
}

export default ProductPage;