import SearchBar from "../components/SearchBar";

const PremAccLink = () => {
  const handleSearch = (term) => {
    console.log("Searching for:", term);
  };

  return (
    <section className="bg-sky-400/15 pt-8 py-10 md:pt-12 mt-8 mx-auto px-4 sm:px-6 lg:px-8
                        flex flex-col items-center sm:flex-row sm:justify-between sm:items-center overflow-x-hidden">
    
      <div className="w-full flex-shrink-0 flex flex-col items-center text-center pr-0 pl-0
                      sm:w-2/3 sm:items-start sm:text-left sm:pr-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
          Find Your Favorite <br/>1200+ Books Available
        </h2>
        
        <div className="w-full items-start sm:max-w-[600px] md:max-w-[820px] lg:max-w-[1000px] mx-auto">
          <SearchBar placeholder="Search for products..." onSearch={handleSearch}/>
        </div>
      </div>

      <div className="hidden flex-shrink-0
                      sm:w-1/3 sm:flex sm:justify-end sm:pl-4">
        <img
          src="/assets/Award.png"
          alt="Trophy, symbolizing premium accounts"
          className="w-full h-auto object-contain max-w-[100px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-[250px] rounded-lg"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/280x200/e0e0e0/555555?text=Image+Missing" }} // Fallback if image not found
        />
      </div>
    </section>
  );
};

export default PremAccLink;
