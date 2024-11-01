/* eslint-disable react/prop-types */
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { Slider } from '@/shadcn/components/ui/slider';
import { Switch } from '@/shadcn/components/ui/switch';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shadcn/components/ui/collapsible';
import { useState } from 'react';

const FilterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='mb-4'>
      <CollapsibleTrigger className='flex items-center justify-between w-full py-2 text-lg md:text-xl font-semibold'>
        {title}
        {isOpen ? (
          <ChevronUp className='h-5 w-5' />
        ) : (
          <ChevronDown className='h-5 w-5' />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className='pt-2 pb-4'>{children}</CollapsibleContent>
    </Collapsible>
  );
};

export const FilterComponent = ({ onApplyFilters }) => {
  const [genres, setGenres] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [offers, setOffers] = useState({ discounted: false, bundle: false });

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
    onApplyFilters({ genres, brands, priceRange, offers });
  };

  return (
    <div className='bg-secondary-bg p-4 md:p-6 rounded-lg text-primary-text font-sans'>
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
              className='text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
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
                className='text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
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
          className='mb-4'
        />
        <div className='flex justify-between text-sm md:text-base'>
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </FilterSection>

      <FilterSection title='Offers'>
        <div className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <Switch
              id='discounted'
              checked={offers.discounted}
              onCheckedChange={() => handleOfferChange('discounted')}
            />
            <label
              htmlFor='discounted'
              className='text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
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
              className='text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              Bundle Deals
            </label>
          </div>
        </div>
      </FilterSection>

      <div className='flex flex-col mt-6 space-y-2'>
        <Button
          variant='outline'
          onClick={handleClearFilters}
          className='w-full md:w-auto bg-primary-bg border-none'>
          Clear Filters
        </Button>
        <Button
          className='w-full md:w-auto bg-accent-blue hover:bg-hover-blue text-white'
          onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
