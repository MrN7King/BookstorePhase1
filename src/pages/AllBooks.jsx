import { FooterWithSitemap } from "@/sections/Footer";
import Navigation from "@/sections/Navigation";
import AllBooksBody from "@/sections/AllBooksBody";

const AllBooks = () => {
  return (
    <>
    <div className='container mx-auto pt-16 overflow-hidden'>
     <Navigation /></div>
     <AllBooksBody/>
     <div className="pt-20">  
        <FooterWithSitemap /></div>
    </>
  )
}

export default AllBooks;