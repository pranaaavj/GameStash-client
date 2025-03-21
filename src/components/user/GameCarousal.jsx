/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GameCarousal = ({
  games,
  autoSwitchInterval = 8000,
  onGameSelect = () => {},
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Function to start rotation
  const startRotation = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setActiveIndex((prev) => (prev + 1) % games.length);
      }
    }, autoSwitchInterval);
  };

  // Initialize rotation
  useEffect(() => {
    startRotation();
    return () => clearInterval(intervalRef.current);
  }, [isPaused, autoSwitchInterval, games.length]);

  // Handle manual game selection
  const handleGameSelect = (index) => {
    setActiveIndex(index);
    onGameSelect(games[index]);
    clearInterval(intervalRef.current);
    startRotation();
  };

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const activeGame = games[activeIndex];

  return (
    <div
      className='w-full bg-[#121212] text-white overflow-hidden rounded-xl px-6 py-3'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className='flex flex-col lg:flex-row'>
        {/* Main Featured Game */}
        <div className='w-full lg:w-[78%] relative overflow-hidden'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeGame.id}
              className='w-full h-full'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}>
              <div className='relative aspect-[16/9] w-full overflow-hidden'>
                <img
                  src={activeGame.image || '/placeholder.svg'}
                  alt={activeGame.title}
                  className='w-full h-full object-cover overflow-hidden rounded-xl'
                />

                {/* Game Info */}
                <div className='absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3'>
                  <div className='space-y-4'>
                    <h1 className='text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg'>
                      {activeGame.title}
                    </h1>
                    <div className='text-sm font-semibold tracking-wider text-white/90'>
                      {activeGame.tagline}
                    </div>
                    <p className='text-base md:text-lg text-gray-200'>
                      {activeGame.description}
                    </p>
                    <div className='text-2xl font-bold'>
                      {activeGame.price > 0
                        ? `₹${activeGame.price.toLocaleString('en-IN')}`
                        : 'Free'}
                    </div>
                    <div className='flex flex-col sm:flex-row gap-3 pt-2'>
                      <Link to={`/game/${activeGame.id}`}>
                        <button className='bg-white hover:bg-gray-200 text-black py-3 px-8 rounded-md font-medium flex items-center justify-center transition-colors'>
                          Buy Now
                        </button>
                      </Link>
                      <button className='border border-white/30 hover:border-white text-white py-3 px-6 rounded-md font-medium flex items-center justify-center transition-colors'>
                        <Plus className='mr-2 h-5 w-5' />
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Game Selection Sidebar with Animated Fill Effect */}
        <div className='w-full lg:w-[22%] bg-transparent pl-5'>
          <div className='h-full py-2 flex flex-col justify-evenly'>
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                className='relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden'
                onClick={() => handleGameSelect(index)}
                initial={{ background: 'rgba(42, 42, 42, 0)' }}
                // animate={{
                //   background:
                //     activeIndex === index
                //       ? 'rgba(42, 42, 42, 0)'
                //       : 'rgba(42, 42, 42, 0)',
                // }}
                transition={{ duration: 0.3 }}>
                {/* Animated Background Fill for Active Game */}
                {activeIndex === index && (
                  <motion.div
                    className={`absolute inset-0 bg-[#2a2a2a] ${
                      activeIndex == index ? 'bg-[#2a2a2a]' : ''
                    }`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: autoSwitchInterval / 1000,
                      ease: 'linear',
                    }}
                  />
                )}

                <div className='relative flex items-center p-4 z-10'>
                  <div className='flex-shrink-0'>
                    <img
                      src={game.thumbnail || '/placeholder.svg'}
                      alt={game.title}
                      className='w-12 h-12 object-cover rounded'
                    />
                  </div>
                  <div className='ml-3'>
                    <h3
                      className={`text-base font-normal ${
                        activeIndex === index ? 'text-white' : 'text-gray-300'
                      }`}>
                      {game.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
