import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GamepadIcon, Mic, MicOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useLazySearchProductsQuery } from '@/redux/api/user/productApi';
import { Button } from '@/shadcn/components/ui/button';
import { debounce } from '@/utils';

export const SearchBar = ({ isSearchVisible, setIsSearchVisible }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [triggerSearchProducts] = useLazySearchProductsQuery();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (transcript) {
      setSearchTerm(transcript);
      handleSearch(transcript);
    }
  }, [transcript]);

  const handleBlur = () => {
    setIsDropdownVisible(false);
    setTimeout(() => {
      setSearchTerm('');
      setIsSearchVisible(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest('.mic-button')
      ) {
        handleBlur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsDropdownVisible(false);
      return;
    }

    try {
      const response = await triggerSearchProducts({
        queryOptions: { search: query },
      }).unwrap();

      if (response?.success) {
        setSearchResults(response?.data?.products || []);
        setIsDropdownVisible(true);
      } else {
        setSearchResults([]);
        setIsDropdownVisible(true); // Still show dropdown for "no results"
      }

      setIsDropdownVisible(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setIsDropdownVisible(true); // Still show dropdown for "no results"
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => handleSearch(query), 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  const handleResultClick = (id) => {
    navigate(`/games/${id}`);
    setIsDropdownVisible(false);
    setTimeout(() => {
      setSearchTerm('');
      setIsSearchVisible(false);
    }, 200);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      navigate(`/games?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsDropdownVisible(false);
      setSearchTerm('');
      setIsSearchVisible(false);
    }
  };

  const startListening = (event) => {
    event.stopPropagation();
    if (!browserSupportsSpeechRecognition) {
      alert('This browser does not support speech recognition.');
      return;
    }
    resetTranscript();
    setIsListening(true);
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
    });
  };

  const stopListening = (event) => {
    event.stopPropagation();
    SpeechRecognition.stopListening();
    setIsListening(false);
    if (transcript) {
      setSearchTerm(transcript.trim());
    }
  };

  useEffect(() => {
    if (!isSearchVisible) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    }
  }, [isSearchVisible]);

  return (
    <div
      className='relative'
      ref={searchRef}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => {
            setIsSearchVisible(!isSearchVisible);
            if (!isSearchVisible) inputRef.current?.focus();
          }}
          className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10 z-10'>
          <Search className='h-6 w-6' />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '200px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className='absolute right-0 top-1/2 -translate-y-1/2'>
            <motion.div className='flex items-center bg-primary-bg text-primary-text rounded-full px-4 py-2 w-full'>
              <input
                ref={inputRef}
                type='text'
                placeholder='Search games...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className='flex-grow text-sm bg-transparent outline-none'
                autoFocus
              />

              <div className='relative ml-2 mic-button'>
                <button
                  className={`transition-all ${
                    isListening ? 'animate-pulse' : ''
                  }`}
                  onMouseDown={startListening}
                  onTouchStart={startListening}
                  onMouseUp={stopListening}
                  onTouchEnd={stopListening}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  aria-label={
                    isListening ? 'Stop voice search' : 'Start voice search'
                  }>
                  {isListening ? (
                    <Mic className='w-5 h-5 text-accent-red' />
                  ) : (
                    <MicOff className='w-5 h-5 text-gray-400' />
                  )}
                </button>

                {showTooltip && (
                  <div className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-36 bg-secondary-bg text-primary-text text-xs rounded-md p-2 shadow-lg z-50'>
                    Hold to use voice search
                    <div className='absolute -top-1 left-1/2 -translate-x-1/2 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-secondary-bg' />
                  </div>
                )}
              </div>
            </motion.div>

            <AnimatePresence>
              {isDropdownVisible && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className='absolute top-full right-0 mt-2 bg-secondary-bg rounded-md shadow-lg overflow-hidden z-50 border border-primary-bg/20'
                  style={{ width: '400px' }}>
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <motion.div
                        key={result._id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className='p-3 hover:bg-primary-bg/10 cursor-pointer transition-colors duration-150 border-b border-primary-bg/10 last:border-b-0'
                        onClick={() => handleResultClick(result._id)}>
                        <div className='flex items-center space-x-3'>
                          <div className='relative w-12 h-12 flex-shrink-0'>
                            <img
                              src={result?.images?.[0] || '/placeholder.svg'}
                              alt={result?.name}
                              className='w-full h-full object-cover rounded-md'
                            />
                            {result?.bestOffer?.discountValue && (
                              <div className='absolute -top-1 -right-1 bg-accent-red text-white text-[10px] font-bold px-1 py-0.5 rounded-full'>
                                -{result.bestOffer.discountValue}%
                              </div>
                            )}
                          </div>
                          <div className='flex-1'>
                            <h3 className='text-sm font-medium text-primary-text truncate'>
                              {result?.name}
                            </h3>
                            <p className='text-xs text-primary-text/60 mt-1 flex items-center'>
                              <GamepadIcon className='w-3 h-3 mr-1' />
                              {result?.genre?.name}
                            </p>
                          </div>
                          <div className='bg-accent-red/10 text-accent-red text-xs font-semibold px-2 py-1 rounded-full'>
                            {result?.discountedPrice ? (
                              <>₹{result.discountedPrice.toFixed(2)}</>
                            ) : (
                              <>
                                {result?.price
                                  ? `₹${result.price.toFixed(2)}`
                                  : 'Free'}
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='p-4 text-center'>
                      <Search className='w-5 h-5 text-primary-text/40 mx-auto mb-2' />
                      <p className='text-sm text-primary-text/70'>
                        No games found
                      </p>
                      <p className='text-xs text-primary-text/50 mt-1'>
                        Try a different search term
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
