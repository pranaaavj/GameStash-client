/* eslint-disable react/prop-types */
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shadcn/components/ui/select';
import { Button } from '@/shadcn/components/ui/button';
import { Slider } from '@/shadcn/components/ui/slider';
import { Switch } from '@/shadcn/components/ui/switch';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetAllBrandsQuery,
  useGetAllGenresQuery,
} from '@/redux/api/user/productApi';

const Filters = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='mb-4'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center justify-between w-full py-2 text-sm font-semibold'>
        {title}
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}>
          <ChevronDown className='h-5 w-5' />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}>
            <div className='pt-2'>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FilterSection = ({ onApplyFilters }) => {
  const [genres, setGenres] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [offers, setOffers] = useState({ discounted: false, bundle: false });
  const [sortingOption, setSortingOption] = useState('popularity:desc');

  const { data: responseBrands } = useGetAllBrandsQuery({});
  const { data: responseGenres } = useGetAllGenresQuery({});

  useEffect(() => {
    if (responseBrands) setBrands(responseBrands?.data?.brands);
    if (responseGenres) setGenres(responseGenres?.data?.genres);
  }, [responseBrands, responseGenres]);

  const handleApplyFilters = () => {
    onApplyFilters({
      genres: selectedGenres,
      brands: selectedBrands,
      priceRange: priceRange.join('-'),
      offers: {
        discounted: offers.discounted.toString(),
        bundle: offers.bundle.toString(),
      },
      sort: sortingOption,
    });
  };

  return (
    <div className='bg-secondary-bg rounded-lg text-primary-text p-4 md:p-6'>
      {/* Sorting Dropdown */}
      <div className='mb-6'>
        <h3 className='text-sm font-semibold mb-2'>Sort By</h3>
        <Select
          value={sortingOption}
          onValueChange={(value) => setSortingOption(value)}>
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

      {/* Genres */}
      <Filters title='Genre'>
        {genres?.length > 0 &&
          genres.map((genre) => (
            <div
              key={genre._id}
              className='flex items-center space-x-2 mb-2'>
              <Checkbox
                id={`genre-${genre._id}`}
                checked={selectedGenres.includes(genre._id)}
                className='border-accent-red'
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
                className='text-sm font-normal'>
                {genre?.name}
              </label>
            </div>
          ))}
      </Filters>

      {/* Brands */}
      <Filters title='Brand'>
        {brands?.length > 0 &&
          brands.map((brand) => (
            <div
              key={brand._id}
              className='flex items-center space-x-2 mb-2'>
              <Checkbox
                id={`brand-${brand._id}`}
                checked={selectedBrands.includes(brand._id)}
                className='border-accent-red'
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
                className='text-sm font-normal'>
                {brand?.name}
              </label>
            </div>
          ))}
      </Filters>

      {/* Price range */}
      <Filters title='Price'>
        <Slider
          min={0}
          max={3000}
          step={50}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value)}
          className='mb-2'
        />
        <div className='flex justify-between text-sm'>
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </Filters>

      {/* Offers */}
      <Filters title='Offers'>
        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Switch
              id='discounted'
              checked={offers.discounted}
              onCheckedChange={() =>
                setOffers((prev) => ({ ...prev, discounted: !prev.discounted }))
              }
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
              onCheckedChange={() =>
                setOffers((prev) => ({ ...prev, bundle: !prev.bundle }))
              }
            />
            <label
              htmlFor='bundle'
              className='text-sm font-normal'>
              Bundle Deals
            </label>
          </div>
        </div>
      </Filters>

      {/* Clear and apply filters */}
      <div className='flex flex-col mt-6 space-y-2'>
        <Button
          onClick={handleApplyFilters}
          className='w-full bg-accent-blue border-none hover:bg-hover-blue text-white'>
          Apply Filters
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            setSelectedGenres([]);
            setSelectedBrands([]);
            setPriceRange([0, 3000]);
            setOffers({ discounted: false, bundle: false });
            setSortingOption('popularity:desc');
            onApplyFilters({
              genres: [],
              brands: [],
              priceRange: '0-3000',
              offers: { discounted: 'false', bundle: 'false' },
              sort: 'popularity:desc',
            });
          }}
          className='w-full bg-primary-bg border-none'>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
