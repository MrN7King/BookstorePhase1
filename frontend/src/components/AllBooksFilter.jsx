import { useCallback, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';

// --- Global Constants (can be moved to a separate constants file if needed elsewhere) ---
const MIN_BOOK_PRICE = 100;
const MAX_BOOK_PRICE = 10000;
const MIN_ACCOUNT_PRICE = 0;
const MAX_ACCOUNT_PRICE = 50000;

const LANGUAGES = ['English', 'Tamil', 'Sinhala'];
const BOOK_CATEGORIES = [
  'Fantasy', 'Non-Fiction', 'Science', 'History', 'Biography',
  'Fiction', 'Thriller', 'Romance', 'Cookbooks', 'Self-Help',
  'Childrens', 'Young Adult', 'Art & Photography', 'Travel',
  'Science Fiction', 'Mystery', 'Horror', 'Drama', 'Poetry',
  'Business', 'Technology', 'Health', 'Religion'
];
const BOOK_FORMATS = ['E-Book', 'Audiobook'];


const ACCOUNT_DURATIONS = ['1 Month', '3 Months', '6 Months', '1 Year', 'Lifetime'];
const ACCOUNT_LICENSE_TYPES = ['Activation Key', 'Account Login', 'Serial Number'];
const ACCOUNT_TAGS = ['Software', 'Subscription', 'License', 'Premium', 'Account', 'Special Products'];


export const AllBooksFilter = ({ onClose, onApplyFilters, showCategories = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([MIN_BOOK_PRICE, MAX_BOOK_PRICE]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Default open state for filter sections
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isLanguageOpen, setIsLanguageOpen] = useState(true);
  const [isFormatOpen, setIsFormatOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false); // Categories often start closed

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const handleCheckboxChange = useCallback((item, setter, currentSelection) => {
    setter((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  }, []); // useCallback to memoize this function

  const toggleSection = useCallback((setter) => {
    setter((prev) => !prev);
  }, []); // useCallback to memoize this function

  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange([MIN_BOOK_PRICE, MAX_BOOK_PRICE]);
    setSelectedLanguages([]);
    setSelectedFormats([]);
    setSelectedCategories([]);
    if (onApplyFilters) {
      onApplyFilters({});
    }
  };

  const handleApply = () => {
    const filters = {
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      language: selectedLanguages.length > 0 ? selectedLanguages.join(',') : undefined,
      format: selectedFormats.length > 0 ? selectedFormats.join(',') : undefined,
      categories: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
    };

    // Remove undefined properties
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    console.log("Applying book filters:", filters);
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full h-full overflow-y-auto relative flex flex-col font-inter">
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-700 bg-gray-100 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
          aria-label="Close filters"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Filter Books</h1>
        <button
          onClick={resetFilters}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Reset
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for Books..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyPress}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
          onClick={() => toggleSection(setIsPriceOpen)}
          aria-expanded={isPriceOpen}
          aria-controls="price-section-books"
        >
          Price
          <svg className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isPriceOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isPriceOpen && (
          <div id="price-section-books" className="mt-3 px-1">
            <div className="flex justify-between text-sm text-black mb-3">
              <span>LKR {priceRange[0]}</span>
              <span>LKR {priceRange[1]}</span>
            </div>
            <Range
              values={priceRange}
              step={1}
              min={MIN_BOOK_PRICE}
              max={MAX_BOOK_PRICE}
              onChange={(values) => {
                setPriceRange(values);
              }}
              renderTrack={({ props, children }) => (
                <div
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    height: '36px',
                    display: 'flex',
                    width: '100%'
                  }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: '5px',
                      width: '100%',
                      borderRadius: '4px',
                      background: getTrackBackground({
                        values: priceRange,
                        colors: ['#ccc', '#2563EB', '#ccc'],
                        min: MIN_BOOK_PRICE,
                        max: MAX_BOOK_PRICE
                      }),
                      alignSelf: 'center'
                    }}
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '18px',
                    width: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#FFF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 2px 6px #AAA',
                    outline: 'none',
                    border: '2px solid #2563EB'
                  }}
                />
              )}
            />
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
          onClick={() => toggleSection(setIsLanguageOpen)}
          aria-expanded={isLanguageOpen}
          aria-controls="language-section-books"
        >
          Language
          <svg className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isLanguageOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isLanguageOpen && (
          <div id="language-section-books" className="mt-4 space-y-3">
            {LANGUAGES.map((language) => (
              <label key={language} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                  checked={selectedLanguages.includes(language)}
                  onChange={() => handleCheckboxChange(language, setSelectedLanguages, selectedLanguages)}
                />
                <span className="ml-3 text-base text-gray-700">{language}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
          onClick={() => toggleSection(setIsFormatOpen)}
          aria-expanded={isFormatOpen}
          aria-controls="format-section-books"
        >
          Format
          <svg className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isFormatOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isFormatOpen && (
          <div id="format-section-books" className="mt-4 space-y-3">
            {BOOK_FORMATS.map((format) => (
              <label key={format} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                  checked={selectedFormats.includes(format)}
                  onChange={() => handleCheckboxChange(format, setSelectedFormats, selectedFormats)}
                />
                <span className="ml-3 text-base text-gray-700">{format}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {showCategories && (
        <div className="mb-0">
          <button
            className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
            onClick={() => toggleSection(setIsCategoriesOpen)}
            aria-expanded={isCategoriesOpen}
            aria-controls="categories-section-books"
          >
            Categories
            <svg className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isCategoriesOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {isCategoriesOpen && (
            <div id="categories-section-books" className="mt-4 space-y-3">
              {BOOK_CATEGORIES.map((category) => (
                <label key={category} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCheckboxChange(category, setSelectedCategories, selectedCategories)}
                  />
                  <span className="ml-3 text-base text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-7 pt-4 sticky bottom-0 bg-white shadow-lg lg:shadow-none flex justify-center">
        <button
          onClick={handleApply}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};



 
export const PremiumAccountFilter = ({ onClose, onApplyFilters }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([MIN_ACCOUNT_PRICE, MAX_ACCOUNT_PRICE]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedLicenseTypes, setSelectedLicenseTypes] = useState([]);
  const [selectedDeliveryFormats, setSelectedDeliveryFormats] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [status, setStatus] = useState(null); // 'available' or 'not_available'

  // Default open state for filter sections
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isDurationOpen, setIsDurationOpen] = useState(true);
  const [isLicenseTypeOpen, setIsLicenseTypeOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(false); // Tags often start closed


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const handleCheckboxChange = useCallback((item, setter, currentSelection) => {
    setter((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  }, []); // useCallback to memoize this function

  const toggleSection = useCallback((setter) => {
    setter((prev) => !prev);
  }, []); // useCallback to memoize this function

  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange([MIN_ACCOUNT_PRICE, MAX_ACCOUNT_PRICE]);
    setSelectedDurations([]);
    setSelectedLicenseTypes([]);
    setSelectedTags([]);
    setStatus(null);
    if (onApplyFilters) {
      onApplyFilters({});
    }
  };

  const handleApply = () => {
    const filters = {
      searchQuery: searchQuery || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      platform: selectedPlatforms.length > 0 ? selectedPlatforms.join(',') : undefined,
      duration: selectedDurations.length > 0 ? selectedDurations.join(',') : undefined,
      licenseType: selectedLicenseTypes.length > 0 ? selectedLicenseTypes.join(',') : undefined,
      deliveryFormat: selectedDeliveryFormats.length > 0 ? selectedDeliveryFormats.join(',') : undefined,
      tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
      status: status || undefined,
    };

    // Remove undefined properties
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    console.log("Applying premium account filters:", filters);
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full h-full overflow-y-auto relative flex flex-col font-inter">
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-700 bg-gray-100 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
          aria-label="Close filters"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Filter</h1>
        <button
          onClick={resetFilters}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Reset
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for Accounts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyPress}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
          onClick={() => toggleSection(setIsPriceOpen)}
          aria-expanded={isPriceOpen}
          aria-controls="price-section-accounts"
        >
          Price
          <svg className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isPriceOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isPriceOpen && (
          <div id="price-section-accounts" className="mt-3 px-1">
            <div className="flex justify-between text-sm text-black mb-3">
              <span>LKR {priceRange[0]}</span>
              <span>LKR {priceRange[1]}</span>
            </div>
            <Range
              values={priceRange}
              step={1}
              min={MIN_ACCOUNT_PRICE}
              max={MAX_ACCOUNT_PRICE}
              onChange={(values) => {
                setPriceRange(values);
              }}
              renderTrack={({ props, children }) => (
                <div
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    height: '36px',
                    display: 'flex',
                    width: '100%'
                  }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: '5px',
                      width: '100%',
                      borderRadius: '4px',
                      background: getTrackBackground({
                        values: priceRange,
                        colors: ['#ccc', '#2563EB', '#ccc'],
                        min: MIN_ACCOUNT_PRICE,
                        max: MAX_ACCOUNT_PRICE
                      }),
                      alignSelf: 'center'
                    }}
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '18px',
                    width: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#FFF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 2px 6px #AAA',
                    outline: 'none',
                    border: '2px solid #2563EB'
                  }}
                />
              )}
            />
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
          onClick={() => toggleSection(setIsDurationOpen)}
          aria-expanded={isDurationOpen}
          aria-controls="duration-section-accounts"
        >
          Duration
          <svg className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isDurationOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isDurationOpen && (
          <div id="duration-section-accounts" className="mt-4 space-y-3">
            {ACCOUNT_DURATIONS.map((duration) => (
              <label key={duration} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                  checked={selectedDurations.includes(duration)}
                  onChange={() => handleCheckboxChange(duration, setSelectedDurations, selectedDurations)}
                />
                <span className="ml-3 text-base text-gray-700">{duration}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
          onClick={() => toggleSection(setIsLicenseTypeOpen)}
          aria-expanded={isLicenseTypeOpen}
          aria-controls="license-type-section-accounts"
        >
          License Type
          <svg className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isLicenseTypeOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isLicenseTypeOpen && (
          <div id="license-type-section-accounts" className="mt-4 space-y-3">
            {ACCOUNT_LICENSE_TYPES.map((type) => (
              <label key={type} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                  checked={selectedLicenseTypes.includes(type)}
                  onChange={() => handleCheckboxChange(type, setSelectedLicenseTypes, selectedLicenseTypes)}
                />
                <span className="ml-3 text-base text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          className="flex items-center justify-between w-full text-lg font-semibold text-gray-800 focus:outline-none"
          onClick={() => toggleSection(setIsTagsOpen)}
          aria-expanded={isTagsOpen}
          aria-controls="tags-section-accounts"
        >
          Type
          <svg className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isTagsOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isTagsOpen && (
          <div id="tags-section-accounts" className="mt-4 space-y-3">
            {ACCOUNT_TAGS.map((tag) => (
              <label key={tag} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleCheckboxChange(tag, setSelectedTags, selectedTags)}
                />
                <span className="ml-3 text-base text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      

      <div className="mt-7 pt-4 sticky bottom-0 bg-white shadow-lg lg:shadow-none flex justify-center">
        <button
          onClick={handleApply}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};