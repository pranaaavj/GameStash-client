import { useState } from 'react';
import { GameListing } from './Game/GameListing';
import { GameCarousal } from './Game/GameCarousal';
import { useGetProductsQuery } from '@/redux/api/user/productApi';
import { GameErrorFallback, GameLoading } from '@/components/error';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Button } from '@/shadcn/components/ui/button';

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

        <section className='mt-12'>
          <h2 className='text-2xl font-bold mb-4 font-poppins'>
            Promotion Cards
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card className='bg-accent-blue text-white'>
              <CardContent className='p-6'>
                <h3 className='text-2xl font-bold mb-2'>Deals of the Week</h3>
                <p className='mb-4'>
                  Check out our hottest deals, refreshed every week!
                </p>
                <Button className='bg-accent-red hover:bg-hover-red text-white'>
                  View Deals
                </Button>
              </CardContent>
            </Card>
            <Card className='bg-accent-green text-white'>
              <CardContent className='p-6'>
                <h3 className='text-2xl font-bold mb-2'>Mobile Rewards</h3>
                <p className='mb-4'>
                  Earn points and unlock exclusive mobile content!
                </p>
                <Button className='bg-accent-red hover:bg-hover-red text-white'>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};
