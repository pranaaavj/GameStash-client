import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useGetProductsQuery } from '@/redux/api/user/productApi';
import { GameCarousal, GameListing } from '@/components/user';
import { useGetRecommendedGamesQuery } from '@/redux/api/user/recommendationApi';
import { PageTransition } from '@/components/common';
import { showToast } from '@/utils';

// Featured games data remains the same
const FEATURED_GAMES = [
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    tagline: 'BEST SELLER',
    description:
      'Embark on an epic quest in the Lands Between. From the creators of Dark Souls.',
    price: 2999,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
  },
  {
    id: 'starfield',
    title: 'Starfield',
    tagline: 'EXPLORE THE STARS',
    description:
      'Bethesda’s next-gen RPG takes you to space. Explore planets, build ships, and unravel mysteries.',
    price: 3499,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg',
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg',
  },
  {
    id: 'the-witcher-3',
    title: 'The Witcher 3: Wild Hunt',
    tagline: 'ICONIC RPG',
    description:
      'An award-winning open-world RPG where you play as Geralt, a monster hunter, in a war-torn world.',
    price: 999,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
  },
  {
    id: 'hollow-knight-silksong',
    title: 'Hollow Knight: Silksong',
    tagline: 'COMING SOON',
    description:
      'A stunning sequel to Hollow Knight, featuring all-new combat, mechanics, and environments.',
    price: 2499,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1030300/header.jpg',
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1030300/header.jpg',
  },
  {
    id: 'valorant',
    title: 'Valorant',
    tagline: 'FREE TO PLAY',
    description:
      'A 5v5 tactical shooter by Riot Games. Choose your agent, strategize, and outplay opponents.',
    price: 0,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg',
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg',
  },
  {
    id: 'red-dead-redemption-2',
    title: 'Red Dead Redemption 2',
    tagline: 'AWARD-WINNING STORY',
    description:
      'Experience the life of an outlaw in this highly immersive open-world Western adventure.',
    price: 1999,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
  },
];

export const Home = () => {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState({
    latestGames: 1,
    topRatedGames: 1,
    discountedGames: 1,
  });

  // const [searchQuery, setSearchQuery] = useState('');
  // const [showSearch, setShowSearch] = useState(false);

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

  const stats = [
    {
      label: 'Games',
      value: latestGamesQuery.data?.data?.totalProducts || '1000+',
    },
    { label: 'Active Users', value: '50K+' },
    { label: 'Reviews', value: '120K+' },
    { label: 'Satisfaction', value: '98%' },
  ];

  console.log(latestGamesQuery.data);

  return (
    <PageTransition>
      <div className='min-h-screen text-primary-text font-sans bg-[#121212]'>
        {/* Hero Section with Search */}
        <div className='relative'>
          <GameCarousal
            games={FEATURED_GAMES}
            autoSwitchInterval={4000}
          />

          {/* Floating search bar */}
          {/* <div className='absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10 px-4'>
            <div className='max-w-3xl mx-auto'>
              <AnimatePresence>
                {showSearch ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className='bg-[#1a1a1a] rounded-lg shadow-xl p-4 flex items-center'>
                    <input
                      type='text'
                      placeholder='Search for games...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='bg-transparent border-none outline-none flex-1 text-[#e5e5e5] placeholder-[#666]'
                    />
                    <button
                      onClick={() => setShowSearch(false)}
                      className='ml-2 text-[#e5e5e5] hover:text-white'>
                      Cancel
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={() => setShowSearch(true)}
                    className='bg-[#1a1a1a] hover:bg-[#252525] transition-colors rounded-lg shadow-xl p-4 flex items-center justify-center w-full'>
                    <Search className='w-5 h-5 mr-2' />
                    <span>Search for games...</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div> */}
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

        {/* Featured Deal - Highlight a special offer */}
        {/* <div className='my-10'>
          <div className='max-w-7xl mx-auto px-4'>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-lg overflow-hidden'>
              <div className='grid md:grid-cols-2 items-center'>
                <div className='p-6 md:p-10'>
                  <div className='text-sm font-semibold text-[#ff4d4d] mb-2'>
                    WEEKEND SPECIAL
                  </div>
                  <h3 className='text-2xl md:text-3xl font-bold text-[#e5e5e5] mb-3'>
                    50% OFF Selected AAA Titles
                  </h3>
                  <p className='text-[#999] mb-6'>
                    Limited time offer on premium games. Ends Sunday at
                    midnight.
                  </p>
                  <button
                    onClick={() => navigate('/deals')}
                    className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white font-medium py-2 px-6 rounded-md transition-colors'>
                    View Deals
                  </button>
                </div>
                <div
                  className='h-[200px] md:h-[300px] bg-cover bg-center'
                  style={{ backgroundImage: `url(${FEATURED_GAMES[0].image})` }}
                />
              </div>
            </motion.div>
          </div>
        </div> */}

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

        {/* Community Section - Social proof
        <div className='my-10 max-w-7xl mx-auto'>
          <h2 className='text-[#e5e5e5] text-xl sm:text-2xl md:text-3xl font-bold font-poppins flex items-center mb-6'>
            Community Highlights
            <ChevronRight className='ml-1 sm:ml-2 h-5 sm:h-6 w-5 sm:w-6' />
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item * 0.1 }}
                className='bg-[#1a1a1a] rounded-lg p-6'>
                <div className='flex items-center mb-4'>
                  <div className='w-10 h-10 rounded-full bg-[#252525]'></div>
                  <div className='ml-3'>
                    <div className='text-[#e5e5e5] font-medium'>User{item}</div>
                    <div className='text-xs text-[#999]'>2 days ago</div>
                  </div>
                </div>
                <p className='text-[#999] text-sm'>
                  This game exceeded all my expectations. The graphics are
                  stunning and the gameplay is addictive!
                </p>
                <div className='mt-4 text-xs text-[#666]'>
                  Review for Game Title
                </div>
              </motion.div>
            ))}
          </div>
        </div> */}

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

        <div className='my-10'>
          <GameListing
            title='Recommended'
            games={recommendedGamesQuery.data?.data?.products}
            currentPage={pageState.discountedGames}
            totalPage={recommendedGamesQuery.data?.data?.totalPages}
            onPageChange={(page) =>
              setPageState((prev) => ({ ...prev, discountedGames: page }))
            }
            isLoading={recommendedGamesQuery.isLoading}
            isFetching={recommendedGamesQuery.isFetching}
            isError={recommendedGamesQuery.isError}
            onRetry={recommendedGamesQuery.refetch}
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
