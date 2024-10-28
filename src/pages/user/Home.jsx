import { motion } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { GameCarousal } from './Game/GameCarousal';
import { GameListing } from './Game/GameListing';

// Mock data for games
const games = [
  {
    id: 1,
    title: 'Cyberpunk 2077',
    genre: 'RPG',
    platform: 'PC',
    price: 59.99,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
  },
  {
    id: 2,
    title: 'Red Dead Redemption 2',
    genre: 'Action',
    platform: 'Xbox',
    price: 39.99,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
  },
  {
    id: 3,
    title: 'The Witcher 3: Wild Hunt',
    genre: 'RPG',
    platform: 'PlayStation',
    price: 29.99,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
  },
  {
    id: 4,
    title: 'Grand Theft Auto V',
    genre: 'Action',
    platform: 'PC',
    price: 29.99,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
  },
  {
    id: 5,
    title: 'Elden Ring',
    genre: 'Adventure',
    platform: 'PC',
    price: 59.99,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
  },
  {
    id: 6,
    title: 'God of War',
    genre: 'Adventure',
    platform: 'PlayStation',
    price: 49.99,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg',
  },
  {
    id: 7,
    title: 'Horizon Zero Dawn',
    genre: 'Action',
    platform: 'PC',
    price: 49.99,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg',
  },
  {
    id: 8,
    title: 'Death Stranding',
    genre: 'Adventure',
    platform: 'PC',
    price: 39.99,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/header.jpg',
  },
];

export const Home = () => {
  

  return (
    <div className='min-h-screen bg-primary-bg text-primary-text font-sans'>
      <main className='container mx-auto px-4 pt-24'>
        {/* Home page carousal */}
        <GameCarousal />

        {/* Listing games */}
        <GameListing
          title='Discover Something New'
          games={games}
        />

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
