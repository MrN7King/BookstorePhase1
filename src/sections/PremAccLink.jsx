"use client";


const PremAccLink = () => {
  return (
    <section className="bg-sky-400/15 py-8 md:py-12 my-8 mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-hidden">
      
     
      <div className="w-2/3 flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left pr-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
          Searching for premium accounts?
        </h2>
        <a
          href="/premium-accounts"
          className="bg-green-500 text-white py-3 px-6 sm:px-8 rounded-lg hover:bg-green-600 transition-colors duration-200 
                     shadow-md hover:shadow-lg inline-block text-sm sm:text-base"
        >
          Explore Now
        </a>
      </div>

      <div className="w-1/3 flex-shrink-0 flex justify-center md:justify-end pl-4">
        <img
          src="/assets/Award.png"
          alt="Trophy, symbolizing premium accounts"
          className="w-full h-auto object-contain max-w-[100px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-[250px]"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/280x200/e0e0e0/555555?text=Image+Missing" }} // Fallback if image not found
        />
      </div>
    </section>
  );
};

export default PremAccLink;
