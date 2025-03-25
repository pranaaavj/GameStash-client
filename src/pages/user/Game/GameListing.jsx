/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { GameCard } from './GameCard';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { UserPagination } from '@/components/user';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export const GameListing = ({
  title,
  games = [],
  currentPage,
  totalPage,
  onPageChange,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔥 GameListing component re-rendered');
  }, []);

  return (
    <div className='bg-[#121212]'>
      <div className='max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12'>
        {/* Title and Pagination */}
        <div className='flex flex-wrap justify-between items-center gap-y-3 mb-6 sm:mb-8'>
          {title && (
            <h2 className='text-[#e5e5e5] text-xl sm:text-2xl md:text-3xl font-bold font-poppins flex items-center'>
              {title}
              <ChevronRight className='ml-1 sm:ml-2 h-5 sm:h-6 w-5 sm:w-6' />
            </h2>
          )}

          {onPageChange && currentPage && totalPage && (
            <div>
              <UserPagination
                totalPages={totalPage}
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>

        {/* Horizontal Scroll on Mobile, Grid on Large Screens */}
        <div className='flex lg:grid overflow-x-auto lg:overflow-visible gap-4 sm:gap-5 xl:gap-6 pb-4 no-scrollbar lg:grid-cols-2 xl:grid-cols-5'>
          {games.map((game) => (
            <motion.div
              key={game._id || game.id}
              onClick={() => navigate(`/games/${game._id || game.id}`)}
              className='flex-shrink-0 w-[80%] sm:w-[45%] md:w-[30%] lg:w-auto'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: games.indexOf(game) * 0.05 }}>
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

GameListing.propTypes = {
  title: PropTypes.string,
  games: PropTypes.array,
  currentPage: PropTypes.number,
  totalPage: PropTypes.number,
  onPageChange: PropTypes.func,
  showLoadMoreCTA: PropTypes.bool,
};
