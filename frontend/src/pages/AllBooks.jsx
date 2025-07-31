import AllBooksBody from "@/sections/AllBooksBody";
import { FooterWithSitemap } from "@/sections/Footer";
import GenreSlides from "@/sections/GenreSlides";
import Navigation from "@/sections/Navigation";

const AllBooks = () => {
  return (
    <>
    <div className='container mx-auto pt-16 overflow-hidden'>
     <Navigation /></div>
      <GenreSlides />
      <h2 style={{ fontFamily: 'Inter, sans-serif' }} className=" py-4 text-3xl md:text-4xl font-extrabold text-center text-gray-800">
        All Books
      </h2>
      <hr></hr>
     <AllBooksBody/>
     <div className="pt-20">  
        <FooterWithSitemap /></div>
    </>
  )
}

export default AllBooks;