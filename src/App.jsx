import Navigation from "./sections/Navigation"
import HeroSectionOne from "./sections/HeroSectionOne";
import Info_Homepage from './sections/Info_Homepage';
import { FooterWithSitemap } from "./sections/Footer";

const App = () => {
  return (
    <>
    <div className='container mx-auto max-w-7xl pt-16'>
      <Navigation />
      </div>
      <HeroSectionOne />
      {/*Best Sellers Cards*/}
      <div className='w-full'>
        <Info_Homepage />
      </div>
      {/*Premium Account Link*/}
      {/*Premium Account Cards*/}
       <FooterWithSitemap />
    </>
  )
}

export default App