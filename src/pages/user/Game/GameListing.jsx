/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { GameCard } from './GameCard';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { UserPagination } from '@/components/user';

export const GameListing = ({
  title,
  games,
  currentPage,
  totalPage,
  onPageChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className='bg-[#121212] py-10 sm:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-[#e5e5e5] text-2xl sm:text-3xl font-bold font-poppins flex items-center'>
            {title}
            <ChevronRight className='ml-2 h-6 w-6' />
          </h2>
          {currentPage && totalPage && onPageChange && (
            <UserPagination
              totalPages={totalPage}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          )}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5'>
          {games.map((game) => (
            <GameCard
              onClick={() => navigate(`/product/${game._id}`)}
              key={game._id}
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
