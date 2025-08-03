import BestSellerSlider from "@/sections/BestSellerSlider";
import { FooterWithSitemap } from "@/sections/Footer";
import HeroSectionOne from "@/sections/HeroSectionOne";
import Info_Homepage from '@/sections/Info_Homepage';
import Navigation from "@/sections/Navigation";
import PremAccLink from "@/sections/PremAccLink";
import PremiumSlider from "@/sections/PremiumSlider";
import Newsletter from '../components/Newsletter';


const Home = () => {
  return (
    <>
    <div className='container mx-auto pt-16 overflow-hidden'>
     <Navigation /></div>
     <HeroSectionOne />
     <BestSellerSlider />   
     <div className="pt-20"><PremAccLink/></div>
     <PremiumSlider/>
     <div className='w-full pt-4'> <Info_Homepage /> </div>
      <div className="pt-4"><Newsletter /></div>
     <div><FooterWithSitemap /></div>
    </>
  )
}

export default Home