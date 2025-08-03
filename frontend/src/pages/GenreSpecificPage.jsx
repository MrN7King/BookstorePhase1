import { FooterWithSitemap } from "@/sections/Footer";
import GenreSpecificBody from "@/sections/GenreSpecificBody"; // Adjusted import path to match the new structure
import Navigation from "@/sections/Navigation";
import GenreBanner from '../components/GenreBanner'; // Path: src/app/page.jsx -> ../components/GenreBanner.jsx


const GenreSpecificPage = () => {
  return (
    <>
    
          <div className='container mx-auto pt-16 overflow-hidden'>
              <Navigation /></div>

         <div className=" bg-gray-100 flex flex-col items-center justify-center ">
        {/* Example 1: Fantasy Genre */}
        <GenreBanner
          genreName="FANTASY"
          backgroundImage="/assets/FantasyBg.jpg" // Path to your image
        />
      </div> 

{/* <GenreSection/> */}
          <hr></hr>
          <GenreSpecificBody />
          <div className="pt-20">
              <FooterWithSitemap /></div>
      </>
  )
}

export default GenreSpecificPage;