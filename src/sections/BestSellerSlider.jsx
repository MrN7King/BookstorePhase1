import { useEffect, useRef, useState } from 'react';
import Card from '../components/Cards';

const Slider = ({ headingText = "Best Seller Books" }) => {
    const sliderRef = useRef(null);

    // book data
    const templateBook = {
        image: "/assets/Book1.jpg",
        title: "Mystery of the Lost Island",
        author: "Jane Smith",
        rating: 4.5,
        price: "RS 175.00",
    };

    // Creates an array of the same thing but increments the index only
    const bestSellerBooks = Array.from({ length: 8 }, (_, index) => ({
        id: index + 1,
        ...templateBook,
    }));

    // Function to handle horizontal scrolling
    const scroll = (direction) => {
        if (sliderRef.current) {
            const cardWidth = 240; // Approximate card width w-[240px]
            const spaceBetweenCards = 32; // space-x-8 (8 * 4px = 32px)
            const scrollAmount = cardWidth + spaceBetweenCards;
            sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    // Optional: Add logic to disable arrows if at start/end
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const checkScrollPosition = () => {
        if (sliderRef.current) {
            const { scrollWidth, scrollLeft, clientWidth } = sliderRef.current;
            setAtStart(scrollLeft === 0);
            // Allow a small tolerance for "at end" detection
            setAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
        }
    };

    useEffect(() => {
        const sliderElement = sliderRef.current;
        if (sliderElement) {
            sliderElement.addEventListener('scroll', checkScrollPosition);
            // Initial check
            checkScrollPosition();
        }
        return () => {
            if (sliderElement) {
                sliderElement.removeEventListener('scroll', checkScrollPosition);
            }
        };
    }, []);

    return (
        <section className="pt-10 px-4 md:px-8 lg:px-12">
            <div className="flex items-center justify-between pb-4 border-b border-gray-300 mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-left">
                    {headingText}
                </h2>
               
                <a
                    href="#" // Replace with your actual "view all" page URL
                    className="flex items-center text-black hover:text-blue-600 transition-colors duration-200
                               font-semibold text-lg md:text-xl group" // Added group for hover effect on arrow
                >
                    <h2 className='mt-2 text-5x1'>View More</h2>
                   <span className="ml-2 text-4xl">›</span>
                </a>
            </div>

            {/* Slider Content Area */}
            <div className="relative flex items-center ">

                {/* Left Arrow Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 z-20 p-3 rounded-full bg-gray-100 shadow-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden sm:block
                               -translate-x-1/2
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={atStart}
                >
                    <img src="./icons/leftArrrow.svg" className="h-3 w-3 text-gray-700" alt="Scroll Left" />
                </button>

                {/* Cards Container - Horizontal Scroll */}
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto scrollbar-hide space-x-8 md:space-x-8 lg:space-x-12 px-2 py-2 w-full"
                    style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
                >
                    {bestSellerBooks.map((book) => (
                        <div key={book.id} className="scroll-snap-align-start flex-shrink-0">
                            <Card book={book} />
                        </div>
                    ))}
                </div>

                {/* Right Arrow Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 z-20 p-3 rounded-full bg-gray-100 shadow-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden sm:block
                               translate-x-1/2
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={atEnd}
                >
                    <img src="./icons/rightArrow.svg" className="h-3 w-3 text-gray-700" alt="Scroll Right" />
                </button>
            </div>
        </section>
    );
};

export default Slider;