import { useEffect, useState } from 'react';
import { GameListing } from './Game/GameListing';
import { useGetProductsQuery } from '@/redux/api/user/productApi';
import { GameErrorFallback, GameLoading } from '@/components/error';
import {
  GameCarousal,
  RecommendedGames,
  ReferralModal,
} from '@/components/user';
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
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg', // Not on Steam, but placeholder image
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
  const [pageState, setPageState] = useState({ latestGames: 1 });
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  const [applyReferral] = useApplyReferralMutation();

  useEffect(() => {
    const hasSeenReferralModal = localStorage.getItem('hasSeenReferralModal');

    if (!hasSeenReferralModal && !userInfo?.referredBy) {
      setIsReferralModalOpen(true);
    }
  }, [userInfo]);

  const handleCloseReferralModal = () => {
    setIsReferralModalOpen(false);
    localStorage.setItem('hasSeenReferralModal', 'true');
  };

  const handleApplyReferral = async (code) => {
    try {
      const response = await applyReferral({ referralCode: code }).unwrap();
      console.log('✅ Referral Applied:', response);
      handleCloseReferralModal();
    } catch (error) {
      throw new Error(error?.data?.message || 'Failed to apply referral code');
    }
  };

  const {
    data: responseLatest,
    error,
    isError,
    isLoading,
    isSuccess,
    refetch,
  } = useGetProductsQuery({ page: pageState.latestGames, limit: 5 });

  const { data: responseRecommended, isSuccess: isRecommendedSuccess } =
    useGetRecommendedGamesQuery({
      limit: 5,
    });

  console.log(responseRecommended?.data);
  return (
    <div className='min-h-screen bg-primary-bg text-primary-text font-sans'>
      <main className='container mx-auto pt-10'>
        {/* Home page carousel */}
        <GameCarousal
          games={FEATURED_GAMES}
          autoSwitchInterval={4000}
        />

        {/* Listing games */}
        <div className='my-10'>
          {isError ? (
            <GameErrorFallback
              message={error?.data?.message}
              onRetry={refetch}
            />
          ) : isLoading ? (
            <GameLoading count={5} />
          ) : (
            isSuccess &&
            responseLatest?.data?.products && (
              <GameListing
                title='Latest games'
                games={responseLatest?.data?.products}
                currentPage={responseLatest?.data.currentPage}
                totalPage={responseLatest?.data.totalPages}
                onPageChange={(page) =>
                  setPageState((prev) => ({ ...prev, latestGames: page }))
                }
              />
            )
          )}
        </div>

        <div className='my-10'>
          {isRecommendedSuccess && (
            <RecommendedGames
              title='Recommended'
              games={responseRecommended?.data}
            />
          )}
        </div>

        <ReferralModal
          isOpen={isReferralModalOpen}
          onClose={handleCloseReferralModal}
          onApply={handleApplyReferral}
        />
      </main>
    </div>
  );
};
