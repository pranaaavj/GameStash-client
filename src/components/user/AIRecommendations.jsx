import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { AIRecommendationCard } from './AIRecommendationCard';
import { GameLoading, GameErrorFallback } from '@/components/error';

export const AIRecommendations = ({
  recommendations = [],
  isLoading,
  isFetching,
  isError,
  onRetry,
}) => {
  if (isLoading || isFetching) {
    return (
      <GameLoading
        count={4}
        title='AI Recommendations'
        hasPagination={false}
      />
    );
  }

  if (isError) {
    return (
      <GameErrorFallback
        message='Failed to load recommendations. Please try again.'
        onRetry={onRetry}
      />
    );
  }

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className='bg-transparent'>
      <div className='max-w-7xl mx-auto'>
        {/* Title with AI indicator */}
        <div className='flex items-center mb-6 sm:mb-8'>
          <motion.div
            className='flex items-center'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Sparkles className='w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-2' />
            <h2 className='text-[#e5e5e5] text-xl sm:text-2xl md:text-3xl font-bold font-poppins flex items-center'>
              AI Recommendations
              <ChevronRight className='ml-1 sm:ml-2 h-5 sm:h-6 w-5 sm:w-6' />
            </h2>
          </motion.div>
        </div>

        {/* Description */}
        <motion.p
          className='text-[#999] mb-6 max-w-2xl'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}>
          Games selected just for you based on your preferences and gaming
          history.
        </motion.p>

        {/* Recommendations Grid */}
        <div className='flex lg:grid overflow-x-auto lg:overflow-visible gap-4 sm:gap-5 xl:gap-6 pb-4 no-scrollbar lg:grid-cols-2 xl:grid-cols-4'>
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation._id}
              className='flex-shrink-0 w-[80%] sm:w-[45%] md:w-[30%] lg:w-auto'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}>
              <AIRecommendationCard recommendation={recommendation} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
