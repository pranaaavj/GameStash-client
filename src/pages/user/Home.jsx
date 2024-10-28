import { motion } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { GameCarousal } from './GameCarousal';
import { GameListing } from './GameListing';

const trendingGames = [
  {
    title: 'Spooky Adventure',
    price: '$19.99',
    image: '/placeholder.svg?height=50&width=50',
  },
  {
    title: 'Zombie Survival',
    price: '$24.99',
    image: '/placeholder.svg?height=50&width=50',
  },
  {
    title: "Witch's Brew",
    price: '$14.99',
    image: '/placeholder.svg?height=50&width=50',
  },
];

const gameCards = [
  {
    title: 'Haunted Mansion',
    type: 'Base Game',
    price: '$29.99',
    discount: '-20%',
    image: '/placeholder.svg?height=200&width=150',
  },
  {
    title: 'Ghost Hunter',
    type: 'Base Game',
    price: '$39.99',
    discount: '-15%',
    image: '/placeholder.svg?height=200&width=150',
  },
  {
    title: "Vampire's Kiss",
    type: 'DLC',
    price: '$9.99',
    image: '/placeholder.svg?height=200&width=150',
  },
  {
    title: 'Werewolf Pack',
    type: 'Base Game',
    price: '$34.99',
    discount: '-25%',
    image: '/placeholder.svg?height=200&width=150',
  },
];

export function Home() {
  return (
    <div className='min-h-screen bg-primary-bg text-primary-text font-sans'>
      <main className='container mx-auto px-4 pt-24'>
        {/* Home page carousal */}
        <GameCarousal />

        <GameListing />
        <div className='flex flex-col md:flex-row gap-8'>
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='flex-grow'>
            <h2 className='text-2xl font-bold mb-4 font-poppins'>
              Discover Something New
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {gameCards.map((game, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'keyframes', stiffness: 300 }}>
                  <Card className='bg-secondary-bg shadow-md'>
                    <img
                      src={game.image}
                      alt={game.title}
                      className='w-full h-48 object-cover rounded-t-lg'
                    />
                    <CardContent className='p-4'>
                      <h3 className='font-bold'>{game.title}</h3>
                      <p className='text-muted-text text-sm'>{game.type}</p>
                      <div className='flex items-center justify-between mt-2'>
                        <span className='font-bold'>{game.price}</span>
                        {game.discount && (
                          <span className='bg-accent-green text-white text-xs font-bold px-2 py-1 rounded'>
                            {game.discount}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='w-full md:w-64 bg-secondary-bg p-4 rounded-lg shadow-md hidden md:block'>
            <h3 className='text-xl font-bold mb-4'>Trending Games</h3>
            <ul className='space-y-4'>
              {trendingGames.map((game, index) => (
                <li
                  key={index}
                  className='flex items-center space-x-2'>
                  <img
                    src={game.image}
                    alt={game.title}
                    className='w-12 h-12 rounded'
                  />
                  <div>
                    <h4 className='font-semibold'>{game.title}</h4>
                    <p className='text-secondary-text text-sm'>{game.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>

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

      <footer className='bg-secondary-bg mt-12 py-8'>
        <div className='container mx-auto px-4 text-center'>
          <nav className='mb-4'>
            <ul className='flex justify-center space-x-4'>
              <li>
                <a
                  href='#'
                  className='text-muted-text hover:text-primary-text'>
                  Support
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-muted-text hover:text-primary-text'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-muted-text hover:text-primary-text'>
                  Terms of Service
                </a>
              </li>
            </ul>
          </nav>
          <div className='flex justify-center space-x-4'>
            <a
              href='#'
              className='text-muted-text hover:text-primary-text'>
              <svg
                className='h-6 w-6'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'>
                <path
                  fillRule='evenodd'
                  d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                  clipRule='evenodd'
                />
              </svg>
            </a>
            <a
              href='#'
              className='text-muted-text hover:text-primary-text'>
              <svg
                className='h-6 w-6'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'>
                <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
              </svg>
            </a>
            <a
              href='#'
              className='text-muted-text hover:text-primary-text'>
              <svg
                className='h-6 w-6'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'>
                <path
                  fillRule='evenodd'
                  d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                  clipRule='evenodd'
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
