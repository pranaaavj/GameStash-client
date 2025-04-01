/* eslint-disable react/display-name */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { GameCard } from '../../components/user';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { UserPagination } from '@/components/user';
import { GameLoading, GameErrorFallback } from '@/components/error';

export const GameListing = memo(
  ({
    title,
    games = [],
    currentPage,
    totalPage,
    onPageChange,
    isLoading,
    isFetching,
    isError,
    onRetry,
  }) => {
    const navigate = useNavigate();

    if (isLoading || isFetching) {
      return (
        <GameLoading
          count={4}
          title={title}
          hasPagination={!!onPageChange}
        />
      );
    }

    if (isError) {
      return (
        <GameErrorFallback
          message='Failed to load games. Please try again.'
          onRetry={onRetry}
        />
      );
    }

    if (!games || games.length === 0) return null;

    return (
      <div className='bg-[#121212]'>
        <div className='max-w-7xl mx-auto'>
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

          {/* Game List */}
          <div className='flex lg:grid overflow-x-auto lg:overflow-visible gap-4 sm:gap-5 xl:gap-6 pb-4 no-scrollbar lg:grid-cols-2 xl:grid-cols-4'>
            {games.map((game, index) => (
              <motion.div
                key={game._id || game.id}
                onClick={() => navigate(`/games/${game._id || game.id}`)}
                className='flex-shrink-0 w-[80%] sm:w-[45%] md:w-[30%] lg:w-auto'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05,
                }}>
                <GameCard game={game} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
