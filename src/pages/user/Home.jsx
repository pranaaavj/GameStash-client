import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { FEATURED_GAMES } from '@/utils/Constants';
import { useGetProductsQuery } from '@/redux/api/user/productApi';
import {
  GameCarousal,
  GameListing,
  // AIRecommendations,
} from '@/components/user';
import { AIRecommendationShowcase } from '@/components/user/AIRecommendationConversation';
import { useGetRecommendedGamesQuery } from '@/redux/api/user/recommendationApi';
import { PageTransition } from '@/components/common';
import { showToast } from '@/utils';

export const Home = () => {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState({
    latestGames: 1,
    topRatedGames: 1,
    discountedGames: 1,
  });

  // Queries remain the same
  const latestGamesQuery = useGetProductsQuery({
    page: pageState.latestGames,
    limit: 4,
    type: 'latest',
  });

  const topRatedGamesQuery = useGetProductsQuery({
    page: pageState.topRatedGames,
    limit: 4,
    type: 'toprated',
  });

  const discountedGamesQuery = useGetProductsQuery({
    page: pageState.discountedGames,
    limit: 4,
    type: 'discounted',
  });

  const recommendedGamesQuery = useGetRecommendedGamesQuery({ limit: 5 });

  // Transform the recommendation data to match our component's expected format
  const transformedRecommendations =
    recommendedGamesQuery.data?.data?.map((item) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      images: item.images,
      platform: item.platform,
      genre: item.genre?.name || 'Unknown',
      brand: item.brand?.name || 'Unknown',
      score: item.score,
      reason: item.reason || 'Recommended for you',
    })) || [];

  const stats = [
    {
      label: 'Games',
      value: latestGamesQuery.data?.data?.totalProducts || '1000+',
    },
    { label: 'Active Users', value: '50K+' },
    { label: 'Reviews', value: '120K+' },
    { label: 'Satisfaction', value: '98%' },
  ];

  return (
    <PageTransition>
      <div className='min-h-screen text-primary-text font-sans bg-[#121212]'>
        {/* Hero Section with Search */}
        <div className='relative'>
          <GameCarousal
            games={FEATURED_GAMES}
            autoSwitchInterval={4000}
          />
        </div>

        {/* Stats Section - Dynamic content based on your store data */}
        <div className='mt-16 mb-10'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className='bg-[#1a1a1a] rounded-lg p-4 text-center'>
                  <div className='text-2xl md:text-3xl font-bold text-[#e5e5e5]'>
                    {stat.value}
                  </div>
                  <div className='text-sm text-[#999]'>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations Section - New! */}
        <div className='my-10'>
          <AIRecommendationShowcase
            recommendations={transformedRecommendations}
            isLoading={recommendedGamesQuery.isLoading}
            isFetching={recommendedGamesQuery.isFetching}
            isError={recommendedGamesQuery.isError}
            onRetry={recommendedGamesQuery.refetch}
          />
        </div>

        {/* Game Listings - Keep your existing implementation */}
        <div className='my-10'>
          <GameListing
            title='Latest Games'
            games={latestGamesQuery.data?.data?.products}
            currentPage={pageState.latestGames}
            totalPage={latestGamesQuery.data?.data?.totalPages}
            onPageChange={(page) =>
              setPageState((prev) => ({ ...prev, latestGames: page }))
            }
            isLoading={latestGamesQuery.isLoading}
            isFetching={latestGamesQuery.isFetching}
            isError={latestGamesQuery.isError}
            onRetry={latestGamesQuery.refetch}
          />
        </div>

        {/* Recently Viewed - Dynamic content based on user behavior */}
        <div className='my-10 max-w-7xl mx-auto'>
          {/* This would normally be populated from user history */}
          <div className='bg-[#1a1a1a] rounded-lg p-6 text-center'>
            <p className='text-[#999]'>
              Games you view will appear here for easy access
            </p>
            <button
              onClick={() => navigate('/games')}
              className='mt-4 bg-transparent hover:bg-[#252525] border border-[#333] text-[#e5e5e5] font-medium py-2 px-6 rounded-md transition-colors'>
              Browse Games
            </button>
          </div>
        </div>

        <div className='my-10'>
          <GameListing
            title='Top Rated Games'
            games={topRatedGamesQuery.data?.data?.products}
            currentPage={pageState.topRatedGames}
            totalPage={topRatedGamesQuery.data?.data?.totalPages}
            onPageChange={(page) =>
              setPageState((prev) => ({ ...prev, topRatedGames: page }))
            }
            isLoading={topRatedGamesQuery.isLoading}
            isFetching={topRatedGamesQuery.isFetching}
            isError={topRatedGamesQuery.isError}
            onRetry={topRatedGamesQuery.refetch}
          />
        </div>

        <div className='my-10'>
          <GameListing
            title='Discounted Games'
            games={discountedGamesQuery.data?.data?.products}
            currentPage={pageState.discountedGames}
            totalPage={discountedGamesQuery.data?.data?.totalPages}
            onPageChange={(page) =>
              setPageState((prev) => ({ ...prev, discountedGames: page }))
            }
            isLoading={discountedGamesQuery.isLoading}
            isFetching={discountedGamesQuery.isFetching}
            isError={discountedGamesQuery.isError}
            onRetry={discountedGamesQuery.refetch}
          />
        </div>

        {/* Newsletter Section */}
        <div className='my-10 max-w-7xl mx-auto px-4'>
          <div className='bg-[#1a1a1a] rounded-lg p-6 md:p-10'>
            <div className='max-w-2xl mx-auto text-center'>
              <h2 className='text-[#e5e5e5] text-xl sm:text-2xl md:text-3xl font-bold font-poppins mb-4'>
                Stay Updated
              </h2>
              <p className='text-[#999] mb-6'>
                Subscribe to get notified about game releases, exclusive deals,
                and more.
              </p>
              <div className='flex flex-col sm:flex-row gap-2'>
                <input
                  type='email'
                  placeholder='Your email address'
                  className='flex-1 bg-[#252525] border border-[#333] rounded-md px-4 py-2 text-[#e5e5e5] placeholder-[#666] focus:outline-none focus:border-[#444]'
                />
                <button
                  onClick={() =>
                    showToast.error(
                      'Something went wrong, please try again later'
                    )
                  }
                  className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white font-medium py-2 px-6 rounded-md transition-colors'>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
