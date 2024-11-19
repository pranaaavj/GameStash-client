/* eslint-disable react/prop-types */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { Slider } from '@/shadcn/components/ui/slider';
import { Switch } from '@/shadcn/components/ui/switch';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shadcn/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select';

const FilterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='mb-4'>
      <CollapsibleTrigger className='flex items-center justify-between w-full py-2 text-sm font-semibold'>
        {title}
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}>
          <ChevronDown className='h-5 w-5' />
        </motion.div>
      </CollapsibleTrigger>
      <CollapsibleContent className='pt-2'>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const FilterComponent = ({ onApplyFilters }) => {
  const [genres, setGenres] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [offers, setOffers] = useState({ discounted: false, bundle: false });
  const [sortingOption, setSortingOption] = useState('popularity:desc');

  const handleGenreChange = (genre) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleBrandChange = (brand) => {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleOfferChange = (offer) => {
    setOffers((prev) => ({ ...prev, [offer]: !prev[offer] }));
  };

  const handleClearFilters = () => {
    setGenres([]);
    setBrands([]);
    setPriceRange([0, 100]);
    setOffers({ discounted: false, bundle: false });
  };

  const handleApplyFilters = () => {
    onApplyFilters({ genres, brands, priceRange, offers, sortingOption });
  };

  const handleSortingChange = (value) => {
    setSortingOption(value);
  };

  return (
    <div className='bg-secondary-bg rounded-lg text-primary-text p-4 md:p-6'>
      {/* Sorting Dropdown */}
      <div className='mb-6'>
        <h3 className='text-sm font-semibold mb-2'>Sort By</h3>
        <Select
          value={sortingOption}
          onValueChange={handleSortingChange}>
          <SelectTrigger className='w-full'>
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
      </div>

      {/* Filter Sections */}
      <FilterSection title='Genre'>
        {['Action', 'Adventure', 'RPG', 'Strategy', 'Sports'].map((genre) => (
          <div
            key={genre}
            className='flex items-center space-x-2 mb-2'>
            <Checkbox
              id={`genre-${genre}`}
              checked={genres.includes(genre)}
              onCheckedChange={() => handleGenreChange(genre)}
            />
            <label
              htmlFor={`genre-${genre}`}
              className='text-sm font-normal'>
              {genre}
            </label>
          </div>
        ))}
      </FilterSection>

      <FilterSection title='Brand'>
        {['Epic Games', 'Ubisoft', 'EA', 'Activision', 'Bethesda'].map(
          (brand) => (
            <div
              key={brand}
              className='flex items-center space-x-2 mb-2'>
              <Checkbox
                id={`brand-${brand}`}
                checked={brands.includes(brand)}
                onCheckedChange={() => handleBrandChange(brand)}
              />
              <label
                htmlFor={`brand-${brand}`}
                className='text-sm font-normal'>
                {brand}
              </label>
            </div>
          )
        )}
      </FilterSection>

      <FilterSection title='Price'>
        <Slider
          min={0}
          max={100}
          step={1}
          value={priceRange}
          onValueChange={handlePriceChange}
          className='mb-2'
        />
        <div className='flex justify-between text-sm'>
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </FilterSection>

      <FilterSection title='Offers'>
        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Switch
              id='discounted'
              checked={offers.discounted}
              onCheckedChange={() => handleOfferChange('discounted')}
            />
            <label
              htmlFor='discounted'
              className='text-sm font-normal'>
              Discounted Games
            </label>
          </div>
          <div className='flex items-center space-x-2'>
            <Switch
              id='bundle'
              checked={offers.bundle}
              onCheckedChange={() => handleOfferChange('bundle')}
            />
            <label
              htmlFor='bundle'
              className='text-sm font-normal'>
              Bundle Deals
            </label>
          </div>
        </div>
      </FilterSection>

      {/* Buttons */}
      <div className='flex flex-col mt-6 space-y-2'>
        <Button
          variant='outline'
          onClick={handleClearFilters}
          className='w-full bg-primary-bg border-none'>
          Clear Filters
        </Button>
        <Button
          onClick={handleApplyFilters}
          className='w-full bg-accent-blue hover:bg-hover-blue text-white'>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
