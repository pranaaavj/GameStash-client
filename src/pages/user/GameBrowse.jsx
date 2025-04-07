import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { GameCard } from '@/components/user';
import { UserPagination } from '@/components/user';
import { FilterSection } from '@/components/user/FilterSection';
import { useSearchProductsQuery } from '@/redux/api/user/productApi';
import { Button } from '@/shadcn/components/ui/button';

import {
  GameBrowserLoading,
  GameBrowserError,
  GameBrowserEmpty,
} from '@/components/error';
import { PageTransition } from '@/components/common';

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
    <PageTransition>
      <div className='bg-transparent min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          {/* Mobile filter toggle */}
          <div className='lg:hidden mb-4'>
            <Button
              onClick={toggleFilterVisibility}
              variant='outline'
              className='w-full bg-secondary-bg/30 border-none text-primary-text'>
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
                <h2 className='text-3xl text-white font-bold'>
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
                  Array(9)
                    .fill()
                    .map((_, index) => (
                      <GameBrowserLoading key={`skeleton-${index}`} />
                    ))
                ) : isError ? (
                  <GameBrowserError
                    message={error?.data?.message || 'Failed to load games'}
                    onRetry={refetch}
                  />
                ) : responseGames?.data?.products?.length === 0 ? (
                  <GameBrowserEmpty />
                ) : (
                  responseGames?.data?.products.map((game) => (
                    <motion.div
                      key={game._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}>
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
    </PageTransition>
  );
};
