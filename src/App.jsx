import BestSellerSlider from "./sections/BestSellerSlider";
import HeroSectionOne from "./sections/HeroSectionOne";
import Navigation from "./sections/Navigation";
import PremAccLink from "./sections/PremAccLink";
import PremiumSlider from "./sections/PremiumSlider";
import Info_Homepage from './sections/Info_Homepage';
import { FooterWithSitemap } from "./sections/Footer";

const App = () => {
  return (
    <>
    <div className='container mx-auto pt-16 overflow-hidden'>
      <Navigation /></div>
      
     <HeroSectionOne />

     <BestSellerSlider />

      <div className='w-full'>
        <Info_Homepage />
      </div>

      <div className="pt-20">
      <PremAccLink/> </div>
      
      <PremiumSlider/>
      
      <FooterWithSitemap />
    </>
  )
}

export default App