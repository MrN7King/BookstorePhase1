"use client";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Genre from '../components/Genre';

const GenreSlider = ({ headingText = "Explore By Genre", genres = [] }) => {
    const sliderRef = useRef(null);
    const [activeGenreId, setActiveGenreId] = useState(null);
    const navigate = useNavigate();

    // Set the first genre as active by default
    useEffect(() => {
        if (genres.length > 0) {
            setActiveGenreId(genres[0]._id);
        }
    }, [genres]);

    const handleGenreClick = (genreId) => {
        setActiveGenreId(genreId);
        const selectedGenre = genres.find(g => g._id === genreId);
        if (selectedGenre) {
            navigate(`/AllBooks?genres=${selectedGenre.name}`);
        }
    };

    const scroll = (direction) => {
        if (sliderRef.current) {
            const currentActiveIndex = genres.findIndex(g => g._id === activeGenreId);
            let targetIndex = currentActiveIndex;

            const containerWidth = sliderRef.current.offsetWidth;
            const cardElements = Array.from(sliderRef.current.children);
            const firstCardElement = cardElements[0];
            let cardUnitWidth = 0;

            if (firstCardElement && cardElements.length > 1) {
                cardUnitWidth = cardElements[1].offsetLeft - firstCardElement.offsetLeft;
            } else if (firstCardElement) {
                cardUnitWidth = firstCardElement.offsetWidth + 40;
            }

            if (cardUnitWidth === 0) {
                console.warn("Could not determine card unit width for scrolling. Aborting scroll.");
                return;
            }

            const effectiveScrollArea = containerWidth - (cardElements[0] ? cardElements[0].offsetLeft * 2 : 0);
            let cardsToScrollPerClick = Math.floor(effectiveScrollArea / cardUnitWidth);
            cardsToScrollPerClick = Math.max(1, cardsToScrollPerClick - 1);

            if (direction === 'left') {
                targetIndex = Math.max(0, currentActiveIndex - cardsToScrollPerClick);
            } else {
                targetIndex = Math.min(genres.length - 1, currentActiveIndex + cardsToScrollPerClick);
            }

            if (targetIndex === currentActiveIndex) {
                if (direction === 'left' && currentActiveIndex > 0) {
                    targetIndex = currentActiveIndex - 1;
                } else if (direction === 'right' && currentActiveIndex < genres.length - 1) {
                    targetIndex = currentActiveIndex + 1;
                }
            }

            if (targetIndex !== currentActiveIndex) {
                handleGenreClick(genres[targetIndex]._id);
            }
        }
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider || genres.length === 0) return;

        const handleScroll = () => {
            const scrollLeft = slider.scrollLeft;
            const clientWidth = slider.clientWidth;
            const cardElements = Array.from(slider.children);

            let closestGenreId = activeGenreId;
            let minDistance = Infinity;

            cardElements.forEach((card, index) => {
                const cardOffsetLeft = card.offsetLeft;
                const cardWidth = card.offsetWidth;
                const cardCenter = cardOffsetLeft + cardWidth / 2;
                const viewportCenter = scrollLeft + clientWidth / 2;

                const distance = Math.abs(cardCenter - viewportCenter);
                const isCardVisible = (cardOffsetLeft < scrollLeft + clientWidth) && (cardOffsetLeft + cardWidth > scrollLeft);

                if (isCardVisible && distance < minDistance) {
                    minDistance = distance;
                    closestGenreId = genres[index]._id;
                }
            });

            if (scrollLeft < 1) {
                closestGenreId = genres[0]?._id || 1;
            } else if (scrollLeft + clientWidth >= slider.scrollWidth - 1) {
                closestGenreId = genres[genres.length - 1]?._id || 1;
            }

            if (closestGenreId !== activeGenreId) {
                setActiveGenreId(closestGenreId);
            }
        };

        slider.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            slider.removeEventListener('scroll', handleScroll);
        };
    }, [genres, activeGenreId]);

    return (
        <section className="pt-10 lg:pt-15 bg-white overflow-hidden">
            <h2 style={{ fontFamily: 'Inter, sans-serif' }} className=" text-3xl md:text-4xl font-extrabold text-center text-gray-800">
                {headingText}
            </h2>
            <div className="relative flex items-center justify-center px-4 md:px-8 lg:px-16 group">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 lg:left-4 z-30 p-3 rounded-full bg-white border border-gray-200 shadow-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-x-1 hover:scale-110 opacity-0 group-hover:opacity-100 hidden sm:block"
                    aria-label="Previous genres"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="relative w-full max-w-7xl mx-auto overflow-hidden custom-scroll-fade py-6">
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-auto custom-scrollbar space-x-10 px-4 sm:px-8 py-4"
                        style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
                    >
                        {genres.map((genre) => (
                            <div key={genre._id} className="scroll-snap-align-center flex-shrink-0">
                                <Genre
                                    genre={{
                                        id: genre._id,
                                        title: genre.name,
                                        image: genre.cardImageUrl,
                                    }}
                                    isActive={genre._id === activeGenreId}
                                    onClick={handleGenreClick}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 lg:right-4 z-30 p-3 rounded-full bg-white border border-gray-200 shadow-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:translate-x-1 hover:scale-110 opacity-0 group-hover:opacity-100 hidden sm:block"
                    aria-label="Next genres"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default GenreSlider;