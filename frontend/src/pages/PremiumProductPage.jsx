// frontend/src/pages/PremiumProductPage.jsx

import { FooterWithSitemap } from "@/sections/Footer";
import Navigation from "@/sections/Navigation";
import PremiumProductDetails from "@/sections/PremiumProductDetails"; // <--- Import the new component
import { useParams } from 'react-router-dom';

const PremiumProductPage = () => {
  // useParams will automatically pick up 'id' and 'slug' from the route definition
  const { id, slug } = useParams();
  return (
    <>
      <div className='container mx-auto pt-6 overflow-hidden'>
        <Navigation />
      </div>
      {/* Pass only the ID (and optionally slug if PremiumProductDetails needed it, but it uses useParams directly) */}
      <PremiumProductDetails /> {/* PremiumProductDetails uses useParams internally, no need to pass props here */}

      <div className="pt-20"> <FooterWithSitemap /></div>
    </>
  );
}

export default PremiumProductPage;