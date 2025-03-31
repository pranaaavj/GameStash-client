/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { GameCard } from './GameCard';
import { UserPagination } from '@/components/user';
import { FilterSection } from '../../../components/user/FilterSection';
import { useSearchProductsQuery } from '@/redux/api/user/productApi';
import { Button } from '@/shadcn/components/ui/button';

// Loading skeleton for game cards
const GameCardSkeleton = () => (
  <div className='rounded-xl overflow-hidden bg-secondary-bg/30 animate-pulse'>
    <div className='h-48 bg-secondary-bg/50'></div>
    <div className='p-4 space-y-3'>
      <div className='h-4 bg-secondary-bg/50 rounded w-3/4'></div>
      <div className='h-4 bg-secondary-bg/50 rounded w-1/2'></div>
      <div className='h-6 bg-secondary-bg/50 rounded w-1/3 mt-2'></div>
    </div>
  </div>
);

// Error component
const ErrorDisplay = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className='col-span-full flex flex-col items-center justify-center py-10 px-4 text-center'>
    <AlertCircle className='h-12 w-12 text-accent-red mb-4' />
    <h3 className='text-xl font-bold mb-2'>Oops! Something went wrong</h3>
    <p className='text-secondary-text mb-6 max-w-md'>
      {message || "We couldn't load the games. Please try again."}
    </p>
    <Button
      onClick={onRetry}
      className='bg-accent-blue hover:bg-hover-blue text-white'>
      <RefreshCw className='h-4 w-4 mr-2' />
      Try Again
    </Button>
  </motion.div>
);

// Empty results component
const EmptyResults = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className='col-span-full flex flex-col items-center justify-center py-10 px-4 text-center'>
    <div className='bg-secondary-bg/30 p-6 rounded-xl max-w-md'>
      <h3 className='text-xl font-bold mb-2'>No Games Found</h3>
      <p className='text-secondary-text'>
        We could not find any games matching your filters. Try adjusting your
        search criteria or clearing filters.
      </p>
    </div>
  </motion.div>
);

export const GameBrowse = () => {
  const [queryOptions, setQueryOptions] = useState({
    search: '',
    genres: [],
    brands: [],
    priceRange: [0, 3000],
    offers: { discounted: false, bundle: false },
    sortingOption: 'popularity:desc',
  });

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    if (searchQuery) {
      setQueryOptions((prev) => ({ ...prev, search: searchQuery }));
      setPageState((prev) => ({ ...prev, games: 1 }));
    }
  }, [searchQuery]);

  const [pageState, setPageState] = useState({
    games: 1,
    genres: 1,
  });

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const {
    data: responseGames,
    isFetching,
    isError,
    error,
    refetch,
  } = useSearchProductsQuery({
    page: pageState.games,
    limit: 12,
    queryOptions,
  });

  const navigate = useNavigate();

  const handleApplyFilters = (filters) => {
    setQueryOptions(filters);
    setPageState({
      games: 1,
      genres: 1,
    });
    // On mobile, close the filter after applying
    if (window.innerWidth < 1024) {
      setIsFilterVisible(false);
    }
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div className='bg-primary-bg min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        {/* Mobile filter toggle */}
        <div className='lg:hidden mb-4'>
          <Button
            onClick={toggleFilterVisibility}
            variant='outline'
            className='w-full bg-secondary-bg/30 border-accent-blue/20 text-primary-text'>
            {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
          {/* Left Column - Filter */}
          <div
            className={`lg:w-1/4 ${
              isFilterVisible ? 'block' : 'hidden'
            } lg:block`}>
            <FilterSection onApplyFilters={handleApplyFilters} />
          </div>

          {/* Right Column - Game Listings with Pagination */}
          <div className='lg:w-3/4 w-full'>
            <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
              <h2 className='text-xl text-white font-bold'>
                {searchQuery
                  ? `Search Results: "${searchQuery}"`
                  : 'Browse Games'}
              </h2>
              {responseGames?.data?.products &&
                responseGames.data.totalPages > 1 && (
                  <UserPagination
                    totalPages={responseGames?.data?.totalPages}
                    currentPage={responseGames?.data?.currentPage}
                    onPageChange={(page) =>
                      setPageState((prev) => ({ ...prev, games: page }))
                    }
                  />
                )}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {isFetching ? (
                // Loading state
                Array(6)
                  .fill()
                  .map((_, index) => (
                    <GameCardSkeleton key={`skeleton-${index}`} />
                  ))
              ) : isError ? (
                // Error state
                <ErrorDisplay
                  message={error?.data?.message || 'Failed to load games'}
                  onRetry={refetch}
                />
              ) : responseGames?.data?.products?.length === 0 ? (
                // Empty results
                <EmptyResults />
              ) : (
                // Game cards
                responseGames?.data?.products.map((game) => (
                  <motion.div
                    key={game._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}>
                    <GameCard
                      onClick={() => navigate(`/games/${game._id}`)}
                      game={game}
                    />
                  </motion.div>
                ))
              )}
            </div>

            {/* Bottom pagination for mobile */}
            {responseGames?.data?.products &&
              responseGames.data.totalPages > 1 && (
                <div className='mt-8 flex justify-center'>
                  <UserPagination
                    totalPages={responseGames?.data?.totalPages}
                    currentPage={responseGames?.data?.currentPage}
                    onPageChange={(page) =>
                      setPageState((prev) => ({ ...prev, games: page }))
                    }
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
