import { useState } from 'react';
import { GameListing } from './Game/GameListing';
import { GameCarousal } from './Game/GameCarousal';
import { useGetProductsQuery } from '@/redux/api/user/productApi';
import { GameErrorFallback, GameLoading } from '@/components/error';

export const Home = () => {
  const [pageState, setPageState] = useState({
    latestGames: 1,
  });

  const {
    data: responseLatest,
    error,
    isError,
    isLoading,
    isSuccess,
    refetch,
  } = useGetProductsQuery({ page: pageState.latestGames, limit: 5 });

  return (
    <div className='min-h-screen bg-primary-bg text-primary-text font-sans'>
      <main className='container mx-auto pt-10'>
        {/* Home page carousel */}
        <GameCarousal />

        {/* Listing games */}
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
              games={responseLatest?.data.products}
              currentPage={responseLatest?.data.currentPage}
              totalPage={responseLatest?.data.totalPages}
              onPageChange={(page) =>
                setPageState((prev) => ({ ...prev, latestGames: page }))
              }
            />
          )
        )}
      </main>
    </div>
  );
};
