import { useEffect, useState } from 'react';

import { useGetProductsQuery } from '@/redux/api/user/productApi';
import { GameCarousal, ReferralModal, GameListing } from '@/components/user';
import { useUsers } from '@/hooks';
import { useApplyReferralMutation } from '@/redux/api/user/referralApi';
import { useGetRecommendedGamesQuery } from '@/redux/api/user/recommendationApi';

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
  const { userInfo } = useUsers();
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  const [applyReferral] = useApplyReferralMutation();

  useEffect(() => {
    const hasSeenReferralModal = localStorage.getItem('hasSeenReferralModal');

    if (!hasSeenReferralModal && !userInfo?.referredBy) {
      setIsReferralModalOpen(true);
    }
  }, [userInfo]);

  const [pageState, setPageState] = useState({
    latestGames: 1,
    topRatedGames: 1,
    discountedGames: 1,
  });

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

  const handleCloseReferralModal = () => {
    setIsReferralModalOpen(false);
    localStorage.setItem('hasSeenReferralModal', 'true');
  };

  const handleApplyReferral = async (code) => {
    try {
      await applyReferral({ referralCode: code }).unwrap();

      handleCloseReferralModal();
    } catch (error) {
      throw new Error(error?.data?.message || 'Failed to apply referral code');
    }
  };

  return (
    <div className='min-h-screen bg-primary-bg text-primary-text font-sans'>
      {/* Home page carousel */}
      <GameCarousal
        games={FEATURED_GAMES}
        autoSwitchInterval={4000}
      />

      {/* Listing games */}
      <div className='my-10'>
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
      </div>

      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={handleCloseReferralModal}
        onApply={handleApplyReferral}
      />
    </div>
  );
};
