import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { GameCard } from './GameCard';
import { UserPagination } from '@/components/user';
import PropTypes from 'prop-types';

export const GameListing = ({ title, games }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const gamesPerPage = 5;
  const totalPages = Math.ceil(games.length / gamesPerPage);

  return (
    <div className='bg-[#121212] py-10 sm:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-[#e5e5e5] text-2xl sm:text-3xl font-bold font-poppins flex items-center'>
            {title}
            <ChevronRight className='ml-2 h-6 w-6' />
          </h2>
          <UserPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5'>
          {games
            .slice(currentPage * gamesPerPage, (currentPage + 1) * gamesPerPage)
            .map((game) => (
              <GameCard
                key={game.id}
                game={game}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

GameListing.propTypes = {
  title: PropTypes.string,
  games: PropTypes.array,
};
