import BestSellerSlider from '@/sections/BestSellerSlider';
import GenreSlides from '@/sections/GenreSlides';
import HeroTwo from '@/sections/HeroTwo';
import Navigation from '@/sections/Navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Newsletter from '../components/Newsletter';
import { FooterWithSitemap } from '../sections/Footer';

const MainBooks = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Correctly using the relative URL to work with the Vite proxy
        const response = await axios.get('http://localhost:5000/api/genres'); 
       
        // The data is available directly in response.data
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <>
      <div className='container mx-auto pt-8 overflow-hidden'>
        <Navigation />
      </div>
      <HeroTwo />
      {/* Pass the fetched genres to the component */}
      <GenreSlides genres={genres} />
      <BestSellerSlider headingText="Best Sellers" fetchType="random" />
      <BestSellerSlider headingText="Newest Books" fetchType="newest" />
      <BestSellerSlider headingText="Popular Books" fetchType="random" />
      <div className="pt-20"><Newsletter /></div>
      <FooterWithSitemap />
    </>
  );
}

export default MainBooks;