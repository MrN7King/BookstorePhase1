import BestSellerSlider from "@/sections/BestSellerSlider";
import { FooterWithSitemap } from "@/sections/Footer";
import HeroSectionOne from "@/sections/HeroSectionOne";
import Info_Homepage from '@/sections/Info_Homepage';
import Navigation from "@/sections/Navigation";
import PremAccLink from "@/sections/PremAccLink";
import PremiumSlider from "@/sections/PremiumSlider";

const Home = () => {
  return (
    <>
    <div className='container mx-auto pt-16 overflow-hidden'>
     <Navigation /></div>
     <HeroSectionOne />
     <BestSellerSlider />
     <hr></hr>
     <div className='w-full'> <Info_Homepage /> </div>
     <hr></hr>
      <PremAccLink/>
                              <PremiumSlider/>
     <div className="pt-20">  <FooterWithSitemap /></div>
    </>
  )
}

export default Home