import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUsers } from '@/hooks';
import { debounce } from '@/utils/debounce';
import { RecommendedGameCard } from './RecommendedGameCard';

export const RecommendedGames = ({ games, isLoading, isError, refetch }) => {
  const { userInfo } = useUsers();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Debounced scroll handler
  const handleScroll = debounce(checkScrollPosition, 100);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Initial check
      checkScrollPosition();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  // Scroll left/right handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -600,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 600,
        behavior: 'smooth',
      });
    }
  };

  // If user is not logged in, show sign-in prompt
  if (!userInfo) {
    return (
      <div className='my-10 bg-[#121212] rounded-lg overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-[#e5e5e5] text-2xl sm:text-3xl font-bold font-poppins'>
              Recommended for You
            </h2>
          </div>

          <motion.div
            className='bg-[#1a1a1a] rounded-lg p-8 flex flex-col items-center justify-center text-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <LogIn className='w-12 h-12 text-accent-blue mb-4' />
            <h3 className='text-xl font-semibold text-white mb-2'>
              Sign in to see personalized recommendations
            </h3>
            <p className='text-[#a0a0a0] mb-6 max-w-lg'>
              Well suggest games based on your interests, wishlist, and purchase
              history.
            </p>
            <Link
              to='/login'
              className='bg-accent-blue hover:bg-hover-blue text-white px-6 py-3 rounded-md font-medium transition-colors'>
              Sign In
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='my-10 bg-[#121212] rounded-lg overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-[#e5e5e5] text-2xl sm:text-3xl font-bold font-poppins'>
              Recommended for You
            </h2>
          </div>
          <div className='flex space-x-6 overflow-hidden'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className='flex-shrink-0 w-56 h-[23rem] bg-[#1a1a1a] rounded-lg animate-pulse'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className='my-10 bg-[#121212] rounded-lg overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-[#e5e5e5] text-2xl sm:text-3xl font-bold font-poppins'>
              Recommended for You
            </h2>
          </div>
          <div className='bg-[#1a1a1a] rounded-lg p-8 text-center'>
            <p className='text-[#e5e5e5] mb-4'>
              Unable to load recommendations
            </p>
            <button
              onClick={refetch}
              className='bg-accent-blue hover:bg-hover-blue text-white px-4 py-2 rounded-md font-medium transition-colors'>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No recommendations available
  if (!games || games.length === 0) {
    return (
      <div className='my-10 bg-[#121212] rounded-lg overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-[#e5e5e5] text-2xl sm:text-3xl font-bold font-poppins'>
              Recommended for You
            </h2>
          </div>
          <div className='bg-[#1a1a1a] rounded-lg p-8 text-center'>
            <p className='text-[#e5e5e5]'>
              We are still learning your preferences. Check back soon for
              personalized recommendations!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className='my-10 bg-[#121212] rounded-lg overflow-hidden'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='text-[#e5e5e5] text-2xl sm:text-3xl font-bold font-poppins'>
              Recommended for You
            </h2>
            <p className='text-[#a0a0a0] text-sm mt-1'>
              Personalized game suggestions based on your interests
            </p>
          </div>
          <Link
            to='/recommendations'
            className='text-accent-blue hover:text-hover-blue text-sm font-medium'>
            See All Recommendations
          </Link>
        </div>

        {/* Carousel container with navigation arrows */}
        <div className='relative group'>
          {/* Left navigation arrow */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 -ml-4 opacity-0 group-hover:opacity-100 transition-opacity'
              aria-label='Scroll left'>
              <ChevronLeft className='h-6 w-6' />
            </button>
          )}

          {/* Scrollable game container */}
          <div
            ref={scrollContainerRef}
            className='flex space-x-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {games.map((game, index) => (
              <motion.div
                key={game._id}
                className='flex-shrink-0'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: 'easeOut',
                }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                style={{
                  transform: `translateZ(${index * -5}px)`, // Parallax effect
                }}>
                <RecommendedGameCard game={game} />
              </motion.div>
            ))}

            {/* "See More" card at the end */}
            <motion.div
              className='flex-shrink-0 w-56 h-[23rem] bg-[#1a1a1a] rounded-lg flex flex-col items-center justify-center cursor-pointer'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: games.length * 0.05,
                ease: 'easeOut',
              }}
              whileHover={{
                y: -5,
                backgroundColor: '#252525',
                transition: { duration: 0.2 },
              }}>
              <Link
                to='/recommendations'
                className='w-full h-full flex flex-col items-center justify-center p-6 text-center'>
                <ChevronRight className='w-12 h-12 text-accent-blue mb-4' />
                <p className='text-[#e5e5e5] font-medium'>
                  See More Recommendations
                </p>
              </Link>
            </motion.div>
          </div>

          {/* Right navigation arrow */}
          {showRightArrow && (
            <button
              onClick={scrollRight}
              className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 -mr-4 opacity-0 group-hover:opacity-100 transition-opacity'
              aria-label='Scroll right'>
              <ChevronRight className='h-6 w-6' />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
