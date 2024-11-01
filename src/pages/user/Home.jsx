import { motion } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { GameCarousal } from './Game/GameCarousal';
import { GameListing } from './Game/GameListing';
import { useGetProductsQuery } from '@/redux/api/userApi';
import { Alert } from '@/components/common';
import { CircleX } from 'lucide-react';
import { useState } from 'react';
import { GameBrowse } from './Game/GameBrowse';

// import { GameBrowse } from './Game/GameBrowse';
// import { GenreListing } from './GenreListing';

export const Home = () => {
  const [pageState, setPageState] = useState({
    latestGames: 1,
  });

  const {
    data: responseLatest,
    error,
    isError,
    isSuccess,
  } = useGetProductsQuery({ page: pageState.latestGames, limit: 5 });

  if (isError) {
    console.log(error);
  }

  return (
    <div className='min-h-screen bg-primary-bg text-primary-text font-sans'>
      <main className='container mx-auto pt-24'>
        {/* Home page carousal */}
        <GameCarousal />
        {isSuccess && responseLatest?.data?.products && (
          <GameBrowse
            title='Discover Something New'
            games={responseLatest?.data.products}
            currentPage={responseLatest?.data.currentPage}
            totalPage={responseLatest?.data.totalPages}
            onPageChange={(page) =>
              setPageState((prev) => ({ ...prev, latestGames: page }))
            }
          />
        )}
        {/* Listing games */}
        {isError && (
          <Alert
            Icon={CircleX}
            variant='destructive'
            description={
              error?.data?.message || 'Something went wrong! Please try again.'
            }
          />
        )}
        {isSuccess && responseLatest?.data?.products && (
          <GameListing
            title='Discover Something New'
            games={responseLatest?.data.products}
            currentPage={responseLatest?.data.currentPage}
            totalPage={responseLatest?.data.totalPages}
            onPageChange={(page) =>
              setPageState((prev) => ({ ...prev, latestGames: page }))
            }
          />
        )}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className='mt-12'>
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
        </motion.section>
      </main>
    </div>
  );
};
