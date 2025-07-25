import BestSellerSlider from '@/sections/BestSellerSlider';
import GenreSlides from '@/sections/GenreSlides';
import HeroTwo from '@/sections/HeroTwo';
import Navigation from '@/sections/Navigation';
import Newsletter from '../components/Newsletter';
import { FooterWithSitemap } from '../sections/Footer';

const MainBooks = () => {
  return (
  <>
    <div className='container mx-auto pt-8 overflow-hidden'>
         <Navigation /></div>
         <HeroTwo />
         <GenreSlides />
         <BestSellerSlider />
         <BestSellerSlider headingText="Newest Books"/>
         <BestSellerSlider headingText="Popular Books"/>
         <div className="pt-20"><Newsletter /></div>
         <FooterWithSitemap/>
         

    </>
  )
}

export default MainBooks