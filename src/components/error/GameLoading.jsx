import PropTypes from 'prop-types';
import { ShimmerCard } from './ShimmerCard';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export const GameLoading = ({ count = 5, title, hasPagination }) => {
  return (
    <div className='bg-[#121212] py-4 sm:py-7'>
      <div className='max-w-7xl mx-auto px-4 sm:px-7'>
        {/* Placeholder for title and pagination to match the main component's spacing */}
        <div className='flex flex-wrap justify-between items-center gap-y-3 mb-6 sm:mb-8'>
          {title && (
            <div className='flex items-center'>
              <div className='h-8 sm:h-9 md:h-10 w-32 sm:w-40 md:w-48 bg-[#2a2a2a] rounded animate-pulse'></div>
              <ChevronRight className='ml-1 sm:ml-2 h-5 sm:h-6 w-5 sm:w-6 text-[#2a2a2a]' />
            </div>
          )}

          {hasPagination && (
            <div className='h-8 w-32 sm:w-40 bg-[#2a2a2a] rounded animate-pulse'></div>
          )}
        </div>

        {/* Shimmer Cards */}
        <div className='flex lg:grid overflow-x-auto lg:overflow-visible gap-4 sm:gap-5 xl:gap-6 pb-4 no-scrollbar lg:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: count }).map((_, idx) => (
            <motion.div
              key={idx}
              className='flex-shrink-0 w-[80%] sm:w-[45%] md:w-[30%] lg:w-auto'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}>
              <ShimmerCard />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

GameLoading.propTypes = {
  count: PropTypes.number,
  title: PropTypes.string,
  hasPagination: PropTypes.bool,
};
