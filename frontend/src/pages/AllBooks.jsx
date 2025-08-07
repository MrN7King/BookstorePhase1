import GenreBanner from "@/components/GenreBanner";
import AllBooksBody from "@/sections/AllBooksBody";
import { FooterWithSitemap } from "@/sections/Footer";
import GenreSlider from "@/sections/GenreSlides";
import Navigation from "@/sections/Navigation";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const AllBooks = () => {
    const [searchParams] = useSearchParams();
    const [genres, setGenres] = useState([]);
    const [activeGenre, setActiveGenre] = useState(null);
    const [loadingGenres, setLoadingGenres] = useState(true);

    // Fetch all genres once when the page loads
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/genres');
                setGenres(response.data.genres);
            } catch (error) {
                console.error("Error fetching genres:", error);
            } finally {
                setLoadingGenres(false);
            }
        };
        fetchGenres();
    }, []);

    // Sync state with URL parameter for conditional rendering
    useEffect(() => {
        const genreNameParam = searchParams.get('genres');
        if (genreNameParam && genres.length > 0) {
            const foundGenre = genres.find(g => g.name === genreNameParam);
            if (foundGenre) {
                setActiveGenre(foundGenre);
            } else {
                setActiveGenre(null);
            }
        } else {
            setActiveGenre(null);
        }
    }, [searchParams, genres]);

    const hasActiveGenre = !!activeGenre;

    return (
        <>
            <div className='container mx-auto pt-16 overflow-hidden'>
                <Navigation />
            </div>

            {loadingGenres ? (
                // Display a loading state while genres are being fetched
                <div className="text-center p-8">Loading genres...</div>
            ) : hasActiveGenre ? (
                // If a single genre is selected, display its banner
                <GenreBanner
                    genreName={activeGenre.name}
                    backgroundImage={activeGenre.bannerImageUrl}
                />
            ) : (
                // Otherwise, display the genre slider
                <GenreSlider genres={genres} />
            )}

            <h2 style={{ fontFamily: 'Inter, sans-serif' }} className=" py-4 text-3xl md:text-4xl font-extrabold text-center text-gray-800">
                All Books
            </h2>
            <hr />
            <AllBooksBody genres={genres} />
            <div className="pt-20">
                <FooterWithSitemap />
            </div>
        </>
    );
};

export default AllBooks;