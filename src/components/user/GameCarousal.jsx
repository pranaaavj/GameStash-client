import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export const GameCarousal = ({
  games,
  autoSwitchInterval = 8000,
  onGameSelect = () => {},
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const startRotation = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setActiveIndex((prev) => (prev + 1) % games.length);
      }
    }, autoSwitchInterval);
  };

  useEffect(() => {
    startRotation();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, autoSwitchInterval, games.length]);

  const handleGameSelect = (index) => {
    setActiveIndex(index);
    onGameSelect(games[index]);
    clearInterval(intervalRef.current);
    startRotation();
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const activeGame = games[activeIndex];

  return (
    <div
      className='w-full bg-[#121212] text-white overflow-hidden rounded-xl py-3'
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

                <div className='absolute bottom-0 left-0 w-full h-full rounded-b-xl bg-gradient-to-t from-black/80 via-black/40 to-transparent overflow-hidden'>
                  <div className='w-full h-full flex items-end px-3 sm:px-6 md:px-10 pb-3 sm:pb-6 md:pb-10 pt-4 sm:pt-6 md:pt-10'>
                    <div className='space-y-1 sm:space-y-2 md:space-y-4'>
                      <h1 className='text-base sm:text-xl md:text-3xl lg:text-5xl font-bold tracking-tight drop-shadow-lg'>
                        {activeGame.title}
                      </h1>
                      <div className='text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider text-white/90'>
                        {activeGame.tagline}
                      </div>
                      <p className='hidden sm:block text-xs sm:text-sm md:text-base text-gray-200'>
                        {activeGame.description}
                      </p>
                      <div className='text-sm sm:text-base md:text-lg font-bold'>
                        {activeGame.price > 0
                          ? `₹${activeGame.price.toLocaleString('en-IN')}`
                          : 'Free'}
                      </div>
                      <div className='flex flex-col sm:flex-row gap-3 pt-2'>
                        <Link to={`/game/${activeGame.id}`}>
                          <button className='bg-white hover:bg-gray-200 text-black text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-6 rounded-md font-medium flex items-center justify-center transition-colors'>
                            Buy Now
                          </button>
                        </Link>
                        <button className='border border-white/30 hover:border-white text-white text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-6 rounded-md font-medium flex items-center justify-center transition-colors'>
                          <Plus className='mr-2 h-4 w-4' />
                          Add to Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className='hidden lg:flex w-full lg:w-[22%] bg-transparent pl-5 flex-col gap-2 overflow-hidden max-h-[100%] md:max-h-[400px] xl:max-h-full'>
          <div className='h-full py-2 flex flex-col justify-between overflow-hidden'>
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                className='relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden'
                onClick={() => handleGameSelect(index)}
                initial={{ background: 'rgba(42, 42, 42, 0)' }}
                transition={{ duration: 0.3 }}>
                {activeIndex === index && (
                  <motion.div
                    className='absolute inset-0 bg-[#2a2a2a]'
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: autoSwitchInterval / 1000,
                      ease: 'linear',
                    }}
                  />
                )}
                <div className='relative flex items-center px-2 py-1 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 xl:px-3 xl:py-3 z-10'>
                  <div className='flex-shrink-0'>
                    <img
                      src={game.thumbnail || '/placeholder.svg'}
                      alt={game.title}
                      className='w-10 h-10 sm:w-12 sm:h-12 object-cover rounded'
                    />
                  </div>
                  <div className='ml-2 sm:ml-3'>
                    <h3
                      className={`text-xs sm:text-sm font-normal ${
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
