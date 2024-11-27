/* eslint-disable react/prop-types */
import { Button } from '@/shadcn/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, GamepadIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLazySearchProductsQuery } from '@/redux/api/user/productApi';
import { useState, useEffect, useRef, useCallback } from 'react';

export const SearchBar = ({ isSearchVisible, setIsSearchVisible }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [triggerSearchProducts] = useLazySearchProductsQuery();

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const handleBlur = useCallback(() => {
    setIsDropdownVisible(false);
    setTimeout(() => {
      setSearchTerm('');
      setIsSearchVisible(false);
    }, 200);
  }, [setIsSearchVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        handleBlur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleBlur]);

  useEffect(() => {
    let timeoutId;

    const fetchProducts = async () => {
      try {
        const response = await triggerSearchProducts({
          queryOptions: { search: searchTerm },
        }).unwrap();
        console.log(response);
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

    if (searchTerm) {
      timeoutId = setTimeout(() => {
        fetchProducts();
      }, 1000);
    } else {
      setSearchResults([]);
      setSearchTerm('');
      setIsDropdownVisible(false);
    }

    return () => clearTimeout(timeoutId);
  }, [searchTerm, triggerSearchProducts]);

  const handleResultClick = (id) => {
    navigate(`/game/${id}`);
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

  const searchVariants = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        width: { type: 'spring', stiffness: 200, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    visible: {
      width: '280px',
      opacity: 1,
      transition: {
        width: { type: 'spring', stiffness: 200, damping: 20 },
        opacity: { duration: 0.2 },
      },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

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
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={searchVariants}
            transition={{ type: 'tween', duration: 0.2 }}
            className='absolute right-0 top-1/2 -translate-y-1/2 overflow-visible'>
            <motion.input
              ref={inputRef}
              type='text'
              placeholder='Search games...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown} // Handle Enter key
              className='w-full h-9 pl-4 pr-4 text-sm bg-primary-bg text-primary-text rounded-full focus:outline-none'
              autoFocus
            />
            <AnimatePresence>
              {isDropdownVisible && searchResults.length > 0 && (
                <motion.div
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  variants={dropdownVariants}
                  transition={{ duration: 0.2 }}
                  className='absolute top-full left-0 right-0 mt-2 bg-secondary-bg rounded-md shadow-lg overflow-hidden'>
                  {searchResults.map((result) => (
                    <motion.div
                      key={result._id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className='p-3 hover:bg-primary-bg/10 cursor-pointer transition-colors duration-150 ease-in-out'>
                      <div
                        className='flex items-center justify-between'
                        onClick={() => handleResultClick(result._id)}>
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
                          {result?.price}
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
