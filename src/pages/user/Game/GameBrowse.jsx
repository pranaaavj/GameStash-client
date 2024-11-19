/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GameCard } from './GameCard';
import { UserPagination } from '@/components/user';
import { FilterComponent } from '../FilterSection';
import { GenreListing } from '../GenreListing';
import { useGetProductsQuery } from '@/redux/api/user/productApi';
import { useGetAllGenresQuery } from '@/redux/api/user/productApi';

export const GameBrowse = () => {
  const [pageState, setPageState] = useState({
    games: 1,
    genres: 1,
  });

  const {
    data: responseGames,
    error,
    isError,
  } = useGetProductsQuery({ page: pageState.games, limit: 12 });

  const {
    data: responseGenres,
    isError: isGenreError,
    error: genreError,
    isSuccess: isGenreSuccess,
  } = useGetAllGenresQuery({ page: pageState.genres, limit: 5 });

  if (isError) {
    console.log(error);
  }

  if (isGenreError) {
    console.log(genreError);
  }

  const navigate = useNavigate();
  const [filteredGames, setFilteredGames] = useState(
    responseGames?.data?.products || []
  );

  console.log(filteredGames);

  const handleApplyFilters = (filters) => {
    const newFilteredGames = responseGames?.data?.products.filter((game) => {
      const priceInRange =
        game.price >= filters.priceRange[0] &&
        game.price <= filters.priceRange[1];
      const genreMatch =
        filters.genres.length === 0 ||
        filters.genres.some((genre) => game.genres.includes(genre));
      const brandMatch =
        filters.brands.length === 0 || filters.brands.includes(game.brand);
      const offerMatch =
        (!filters.offers.discounted || game.discounted) &&
        (!filters.offers.bundle || game.bundle);
      return priceInRange && genreMatch && brandMatch && offerMatch;
    });
    setFilteredGames(newFilteredGames);
  };

  return (
    <div className='bg-primary-bg'>
      {isGenreSuccess && (
        <GenreListing
          title='Genres'
          genres={responseGenres?.data?.genres}
        />
      )}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left Column - Filter */}
          <div className='lg:w-1/4'>
            <FilterComponent onApplyFilters={handleApplyFilters} />
          </div>

          {/* Right Column - Game Listings with Pagination on Top Right */}
          <div className='lg:w-3/4'>
            <div
              className='flex justify-end
             items-center mb-4'>
              {responseGames?.data?.products && (
                <UserPagination
                  totalPages={responseGames?.data?.totalPage}
                  currentPage={responseGames?.data?.currentPage}
                  onPageChange={(page) =>
                    setPageState((prev) => ({ ...prev, games: page }))
                  }
                />
              )}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
              {responseGames?.data?.products &&
                responseGames?.data?.products.map((game) => (
                  <GameCard
                    onClick={() => navigate(`/game/${game._id}`)}
                    key={game._id}
                    game={game}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
