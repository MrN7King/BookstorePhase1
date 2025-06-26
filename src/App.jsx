import BestSellerSlider from "./sections/BestSellerSlider";
import HeroSectionOne from "./sections/HeroSectionOne";
import Navigation from "./sections/Navigation";
import PremAccLink from "./sections/PremAccLink";
const App = () => {
  return (
    <>
    <div className='container mx-auto pt-16 overflow-hidden'>
      <Navigation /></div>
      
     <HeroSectionOne />
     <BestSellerSlider />
      {/*About Us*/}
      <div className="pt-20">
      <PremAccLink/> </div>
      {/*Premium Account Cards*/}
      {/*Footer*/}
    </>
  )
}

export default App