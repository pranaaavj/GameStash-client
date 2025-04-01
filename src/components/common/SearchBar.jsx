import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GamepadIcon, Mic, MicOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useLazySearchProductsQuery } from '@/redux/api/user/productApi';
import { Button } from '@/shadcn/components/ui/button';

export const SearchBar = ({ isSearchVisible, setIsSearchVisible }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,

    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [triggerSearchProducts] = useLazySearchProductsQuery();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

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
        !event.target.closest('.mic-button') // Prevent closing when clicking mic button
      ) {
        handleBlur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    try {
      const response = await triggerSearchProducts({
        queryOptions: { search: query },
      }).unwrap();
      if (response?.success) {
        setSearchResults(response?.data?.products || []);
        setIsDropdownVisible(true);
      } else {
        setSearchResults([]);
        setIsDropdownVisible(false);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };

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

      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '280px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className='absolute right-0 top-1/2 -translate-y-1/2 overflow-visible'>
            <motion.div className='flex items-center bg-primary-bg text-primary-text rounded-full px-4 py-2'>
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

              {/* 🎤 Hold to Speak Button */}
              <button
                className='ml-2 transition-all mic-button' // Add unique class to prevent outside click closing issue
                onMouseDown={startListening}
                onTouchStart={startListening}
                onMouseUp={stopListening}
                onTouchEnd={stopListening}>
                {isListening ? (
                  <Mic className='w-5 h-5 text-accent-red' />
                ) : (
                  <MicOff className='w-5 h-5 text-gray-400' />
                )}
              </button>
            </motion.div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {isDropdownVisible && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className='absolute top-full left-0 right-0 mt-2 bg-secondary-bg rounded-md shadow-lg overflow-hidden'>
                  {searchResults.map((result) => (
                    <motion.div
                      key={result._id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className='p-3 hover:bg-primary-bg/10 cursor-pointer transition-colors duration-150 ease-in-out'
                      onClick={() => handleResultClick(result._id)}>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='text-sm font-medium text-primary-text'>
                            {result?.name}
                          </h3>
                          <p className='text-xs text-primary-text/60 mt-1 flex items-center'>
                            <GamepadIcon className='w-3 h-3 mr-1' />
                            {result?.genre?.name}
                          </p>
                        </div>
                        <div className='bg-accent-red/10 text-accent-red text-xs font-semibold px-2 py-1 rounded-full'>
                          {result?.price ? `₹${result.price}` : 'Free'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
