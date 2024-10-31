import { CircleX, Heart } from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { useState, useEffect } from 'react';
import { useGetProductsQuery } from '@/redux/api/userApi';
import { AnimatePresence, motion } from 'framer-motion';
import { Alert } from '@/components/common';

export const GameCarousal = () => {
  const {
    data: carousalProducts,
    isError,
    error,
    isLoading,
  } = useGetProductsQuery({ limit: 5 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carousalProducts?.data?.products?.length) {
      const interval = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % carousalProducts.data.products.length
        );
      }, 5000); // Auto-change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [carousalProducts?.data?.products]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(carousalProducts);

  return (
    <div className='max-w-full lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12'>
      <Card className='border-none shadow-none'>
        <CardContent className='p-0'>
          <AnimatePresence mode='popLayout'>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className='relative'>
              <img
                src={
                  carousalProducts?.data?.products[currentIndex]?.images[0] ||
                  ''
                }
                alt={`Product ${carousalProducts?.data?.products[currentIndex]?._id}`}
                className='w-full h-[30vh] sm:h-[50vh] lg:h-[70vh] object-cover rounded-t-lg'
              />
              <div className='absolute bottom-0 left-0 right-0 p-4 lg:p-8'>
                <p className='text-primary-bg text-xl sm:text-2xl lg:text-3xl font-bold mb-2'>
                  {carousalProducts?.data?.products?.[currentIndex]?.price}
                </p>
                <div className='flex space-x-2'>
                  <Button
                    variant='default'
                    className='w-20 sm:w-30 lg:w-40 text-sm lg:text-base'>
                    Buy Now
                  </Button>
                  <Button
                    variant='outline'
                    className='bg-secondary-bg p-2 rounded-full'>
                    <Heart className='h-5 w-5 text-accent-red' />
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      {isError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={
            error?.data?.message || 'Something went wrong! Please try again.'
          }
        />
      )}
    </div>
  );
};