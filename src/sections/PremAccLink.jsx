
const PremAccLink = () => {
  return (
    <section className="bg-sky-400/15 md:py-12 my-8 mx-auto mz px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap">
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0 pl-20">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
          Searching for premium accounts?
        </h2>
        <button className="bg-green-500 text-white py-3 px-8 rounded-lg hover:bg-green-600 transition-colors duration-200 
        shadow-md hover:shadow-lg">
          Explore Now
        </button>
      </div>

      <div className="w-full md:w-1/2 flex justify-center md:justify-end pr-25">
        <img
          src="/assets/Award.png"
          alt="Trophy on a stack of books, symbolizing premium accounts"
          className="w-48 md:w-64 lg:w-72 h-auto object-contain pr-7"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/280x200/e0e0e0/555555?text=Image+Missing" }} // Fallback
        />
      </div>
    </section>
  );
};

export default PremAccLink;
