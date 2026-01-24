import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shadcn/components/ui/select';
import { Button } from '@/shadcn/components/ui/button';

import { useEffect, useState } from 'react';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetAllBrandsQuery,
  useGetAllGenresQuery,
} from '@/redux/api/user/productApi';
import { Badge } from '@/shadcn/components/ui/badge';

const Filters = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className='mb-6 border-b border-primary-bg/20'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center justify-between w-full py-2 text-sm font-semibold hover:text-accent-blue transition-colors'>
        {title}
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}>
          <ChevronDown className='h-5 w-5' />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}>
            <div className='pt-3'>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Loading skeleton for filter options
const FilterSkeleton = () => (
  <div className='space-y-2 animate-pulse'>
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className='flex items-center space-x-2'>
        <div className='h-4 w-4 rounded bg-primary-bg/80'></div>
        <div className='h-4 bg-primary-bg/80 rounded w-full'></div>
      </div>
    ))}
  </div>
);

export const FilterSection = ({ onApplyFilters }) => {
  const [genres, setGenres] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortingOption, setSortingOption] = useState('popularity:desc');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Add delay state to ensure minimum skeleton display time
  const [showGenresSkeleton, setShowGenresSkeleton] = useState(true);
  const [showBrandsSkeleton, setShowBrandsSkeleton] = useState(true);

  const {
    data: responseBrands,
    isLoading: isBrandsLoading,
    isError: isBrandsError,
  } = useGetAllBrandsQuery({});

  const {
    data: responseGenres,
    isLoading: isGenresLoading,
    isError: isGenresError,
  } = useGetAllGenresQuery({});

  // Handle genres with minimum delay
  useEffect(() => {
    if (responseGenres) {
      // Ensure skeleton shows for at least 500ms
      const timer = setTimeout(() => {
        setGenres(responseGenres?.data?.genres);
        setShowGenresSkeleton(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [responseGenres]);

  // Handle brands with minimum delay
  useEffect(() => {
    if (responseBrands) {
      // Ensure skeleton shows for at least 500ms
      const timer = setTimeout(() => {
        setBrands(responseBrands?.data?.brands);
        setShowBrandsSkeleton(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [responseBrands]);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (selectedGenres.length > 0) count++;
    if (selectedBrands.length > 0) count++;
    if (sortingOption !== 'popularity:desc') count++;
    setActiveFiltersCount(count);
  }, [selectedGenres, selectedBrands, sortingOption]);

  const handleApplyFilters = () => {
    onApplyFilters({
      genres: selectedGenres,
      brands: selectedBrands,
      sort: sortingOption,
    });
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setSelectedBrands([]);
    setSortingOption('popularity:desc');
    onApplyFilters({
      genres: [],
      brands: [],
      sort: 'popularity:desc',
    });
  };

  // Check if we should show skeleton (either loading or enforcing minimum delay)
  const shouldShowGenresSkeleton = isGenresLoading || showGenresSkeleton;
  const shouldShowBrandsSkeleton = isBrandsLoading || showBrandsSkeleton;

  return (
    <div className='bg-secondary-bg/40 rounded-xl text-primary-text p-5 md:p-6 shadow-md sticky top-20'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-bold'>Filters</h2>
        {activeFiltersCount > 0 && (
          <Badge
            variant='outline'
            className='bg-accent-blue/10 text-accent-blue border-accent-blue/30'>
            {activeFiltersCount} active
          </Badge>
        )}
      </div>

      {/* Sorting Dropdown */}
      <Filters
        title='Sort By'
        defaultOpen={true}>
        <Select
          value={sortingOption}
          onValueChange={(value) => setSortingOption(value)}>
          <SelectTrigger className='w-full bg-primary-bg/30 border-accent-blue/20'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='popularity:desc'>Popularity</SelectItem>
            <SelectItem value='price:asc'>Price: Low to High</SelectItem>
            <SelectItem value='price:desc'>Price: High to Low</SelectItem>
            <SelectItem value='averageRating:desc'>Average Ratings</SelectItem>
            <SelectItem value='createdAt:desc'>New Arrivals</SelectItem>
            <SelectItem value='name:asc'>A-Z</SelectItem>
            <SelectItem value='name:desc'>Z-A</SelectItem>
          </SelectContent>
        </Select>
      </Filters>

      {/* Genres */}
      <Filters title='Genre'>
        <AnimatePresence mode='wait'>
          {shouldShowGenresSkeleton ? (
            <motion.div
              key='genres-skeleton'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <FilterSkeleton />
            </motion.div>
          ) : isGenresError ? (
            <motion.div
              key='genres-error'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='flex items-center text-accent-red text-sm'>
              <AlertCircle className='h-4 w-4 mr-2' />
              Failed to load genres
            </motion.div>
          ) : genres?.length > 0 ? (
            <motion.div
              key='genres-content'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='max-h-48 overflow-y-auto pr-2 no-scrollbar'>
              {genres.map((genre, index) => (
                <motion.div
                  key={genre._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  className='flex items-center space-x-2 hover:bg-primary-bg/10 p-1 rounded transition-colors'>
                  <Checkbox
                    id={`genre-${genre._id}`}
                    checked={selectedGenres.includes(genre._id)}
                    className='border-accent-blue data-[state=checked]:bg-accent-blue data-[state=checked]:text-white'
                    onCheckedChange={() =>
                      setSelectedGenres((prev) =>
                        prev.includes(genre._id)
                          ? prev.filter((id) => id !== genre._id)
                          : [...prev, genre._id]
                      )
                    }
                  />
                  <label
                    htmlFor={`genre-${genre._id}`}
                    className='text-sm font-medium cursor-pointer flex-1'>
                    {genre?.name}
                  </label>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.p
              key='genres-empty'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='text-sm text-secondary-text py-2'>
              No genres available
            </motion.p>
          )}
        </AnimatePresence>
      </Filters>

      {/* Brands */}
      <Filters title='Brand'>
        <AnimatePresence mode='wait'>
          {shouldShowBrandsSkeleton ? (
            <motion.div
              key='brands-skeleton'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <FilterSkeleton />
            </motion.div>
          ) : isBrandsError ? (
            <motion.div
              key='brands-error'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='flex items-center text-accent-red text-sm py-2'>
              <AlertCircle className='h-4 w-4 mr-2' />
              Failed to load brands
            </motion.div>
          ) : brands?.length > 0 ? (
            <motion.div
              key='brands-content'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='max-h-48 overflow-y-auto pr-2 no-scrollbar'>
              {brands.map((brand, index) => (
                <motion.div
                  key={brand._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  className='flex items-center space-x-2 hover:bg-primary-bg/10 p-1 rounded transition-colors'>
                  <Checkbox
                    id={`brand-${brand._id}`}
                    checked={selectedBrands.includes(brand._id)}
                    className='border-accent-blue data-[state=checked]:bg-accent-blue data-[state=checked]:text-white'
                    onCheckedChange={() =>
                      setSelectedBrands((prev) =>
                        prev.includes(brand._id)
                          ? prev.filter((id) => id !== brand._id)
                          : [...prev, brand._id]
                      )
                    }
                  />
                  <label
                    htmlFor={`brand-${brand._id}`}
                    className='text-sm font-medium cursor-pointer flex-1'>
                    {brand?.name}
                  </label>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.p
              key='brands-empty'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='text-sm text-secondary-text py-2'>
              No brands available
            </motion.p>
          )}
        </AnimatePresence>
      </Filters>

      {/* Clear and apply filters */}
      <div className='flex flex-col mt-6 space-y-3'>
        <Button
          onClick={handleApplyFilters}
          className='w-full bg-accent-blue hover:bg-hover-blue border-none text-white'>
          Apply Filters
        </Button>
        <Button
          variant='outline'
          onClick={handleClearFilters}
          className='w-full bg-accent-red hover:bg-hover-red border-none hover:text-primary-text'>
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};