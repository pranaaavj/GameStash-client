import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Button } from '@/shadcn/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

const items = [
  {
    id: 1,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg', // A sci-fi theme
    name: 'Galaxy Raiders',
    price: '$29.99',
  },
  {
    id: 2,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg', // Fantasy adventure
    name: 'Kingdom Quest',
    price: '$59.99',
  },
  {
    id: 3,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg', // Post-apocalyptic setting
    name: 'Wasteland Survival',
    price: '$39.99',
  },
];

export const GameCarousal = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000); // Auto-change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
                src={items[currentIndex].image}
                alt={`Product ${items[currentIndex].id}`}
                className='w-full h-[30vh] sm:h-[50vh] lg:h-[70vh] object-cover rounded-t-lg'
              />
              <div className='absolute bottom-0 left-0 right-0 p-4 lg:p-8'>
                <p className='text-primary-bg text-xl sm:text-2xl lg:text-3xl font-bold mb-2'>
                  {items[currentIndex].price}
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
    </div>
  );
};
