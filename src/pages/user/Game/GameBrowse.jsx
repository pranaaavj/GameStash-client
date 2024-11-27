import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { GameCard } from './GameCard';
import { UserPagination } from '@/components/user';
import { FilterSection } from '../FilterSection';
import { GenreListing } from '../GenreListing';
import {
  useGetAllGenresQuery,
  useSearchProductsQuery,
} from '@/redux/api/user/productApi';

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

  const { data: responseGames, isFetching } = useSearchProductsQuery({
    page: pageState.games,
    limit: 12,
    queryOptions,
  });

  const { data: responseGenres, isSuccess: isGenresSuccess } =
    useGetAllGenresQuery({
      page: pageState.genres,
      limit: 5,
    });

  const navigate = useNavigate();

  const handleApplyFilters = (filters) => {
    setQueryOptions(filters);
    setPageState({
      games: 1,
      genres: 1,
    });
  };

  return (
    <div className='bg-primary-bg'>
      {isGenresSuccess && (
        <GenreListing
          title='Genres'
          genres={responseGenres?.data?.genres}
          currentPage={pageState.genres}
          totalPages={responseGenres?.data?.totalPages}
          onPageChange={(page) =>
            setPageState((prev) => ({ ...prev, genres: page }))
          }
        />
      )}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left Column - Filter */}
          <div className='lg:w-1/4'>
            <FilterSection onApplyFilters={handleApplyFilters} />
          </div>

          {/* Right Column - Game Listings with Pagination */}
          <div className='lg:w-3/4'>
            <div className='flex justify-end items-center mb-4'>
              {responseGames?.data?.products && (
                <UserPagination
                  totalPages={responseGames?.data?.totalPages}
                  currentPage={responseGames?.data?.currentPage}
                  onPageChange={(page) =>
                    setPageState((prev) => ({ ...prev, games: page }))
                  }
                />
              )}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {isFetching ? (
                <p>Loading...</p>
              ) : (
                responseGames?.data?.products.map((game) => (
                  <GameCard
                    onClick={() => navigate(`/game/${game._id}`)}
                    key={game._id}
                    game={game}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
