import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Brain,
  Gamepad2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AIRecommendationShowcase = ({
  recommendations = [],
  isLoading,
  isFetching,
  isError,
  onRetry,
}) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef();
  const containerRef = useRef();

  const handleGameClick = (id) => {
    navigate(`/games/${id}`);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + recommendations.length) % recommendations.length
    );
  };

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => {
      stopAutoPlay();
    };
  }, [isAutoPlaying, recommendations.length, activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (isLoading || isFetching) {
    return (
      <div className='max-w-7xl mx-auto py-12'>
        <div className='flex items-center mb-6'>
          <Sparkles className='w-6 h-6 text-blue-400 mr-2' />
          <h2 className='text-[#e5e5e5] text-2xl md:text-3xl font-bold'>
            AI Recommendations
          </h2>
        </div>
        <div className='bg-[#1a1a1a] rounded-xl h-[400px] animate-pulse flex items-center justify-center'>
          <div className='text-[#666] flex flex-col items-center'>
            <Brain className='w-12 h-12 mb-4 opacity-50' />
            <p>Loading your personalized recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='max-w-7xl mx-auto py-12'>
        <div className='flex items-center mb-6'>
          <Sparkles className='w-6 h-6 text-blue-400 mr-2' />
          <h2 className='text-[#e5e5e5] text-2xl md:text-3xl font-bold'>
            AI Recommendations
          </h2>
        </div>
        <div className='bg-[#1a1a1a] rounded-xl p-8 text-center'>
          <p className='text-[#e5e5e5] mb-4'>Failed to load recommendations</p>
          <button
            onClick={onRetry}
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors'>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) return null;

  const activeRecommendation = recommendations[activeIndex];

  return (
    <div
      className='max-w-7xl mx-auto py-12'
      ref={containerRef}>
      {/* Header with AI indicator */}
      <div className='flex items-center justify-between mb-6'>
        <motion.div
          className='flex items-center'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>
          <Sparkles className='w-6 h-6 text-blue-400 mr-2' />
          <h2 className='text-[#e5e5e5] text-2xl md:text-3xl font-bold'>
            AI Recommendations
          </h2>
        </motion.div>

        <div className='flex space-x-2'>
          <button
            onClick={prevSlide}
            className='bg-[#2a2a2a] hover:bg-[#333] p-2 rounded-full transition-colors'
            aria-label='Previous recommendation'>
            <ChevronLeft className='w-5 h-5 text-[#e5e5e5]' />
          </button>
          <button
            onClick={nextSlide}
            className='bg-[#2a2a2a] hover:bg-[#333] p-2 rounded-full transition-colors'
            aria-label='Next recommendation'>
            <ChevronRight className='w-5 h-5 text-[#e5e5e5]' />
          </button>
        </div>
      </div>

      {/* Interactive Showcase */}
      <div className='relative bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-xl overflow-hidden'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className='grid grid-cols-1 md:grid-cols-2 min-h-[400px]'>
            {/* Left side - Game Image with Overlay */}
            <div className='relative overflow-hidden'>
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7 }}
                className='absolute inset-0 bg-black/30 z-10'
              />
              <motion.img
                src={activeRecommendation.images?.[0] || '/placeholder.svg'}
                alt={activeRecommendation.name}
                className='w-full h-full object-cover'
                initial={{ scale: 1.1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
              />

              {/* Platform Badge */}
              <div className='absolute top-4 left-4 z-20 bg-[#2a2a2a]/80 backdrop-blur-sm px-3 py-1 rounded-full'>
                <span className='text-xs font-medium text-[#e5e5e5]'>
                  {activeRecommendation.platform}
                </span>
              </div>

              {/* Score Badge */}
              <div className='absolute top-4 right-4 z-20'>
                <div className='bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center'>
                  <Sparkles className='w-3 h-3 mr-1' />
                  {activeRecommendation.score.toFixed(1)}
                </div>
              </div>
            </div>

            {/* Right side - Game Info */}
            <div className='p-6 md:p-8 flex flex-col justify-between'>
              <div>
                <div className='flex items-center mb-2'>
                  <Gamepad2 className='w-5 h-5 text-blue-400 mr-2' />
                  <span className='text-blue-400 text-sm font-medium'>
                    {activeRecommendation.genre}
                  </span>
                </div>

                <h3 className='text-[#e5e5e5] text-2xl md:text-3xl font-bold mb-4'>
                  {activeRecommendation.name}
                </h3>

                <div className='bg-[#2a2a2a] rounded-lg p-4 mb-6'>
                  <p className='text-[#999] text-sm italic mb-2'>
                    Why we think youll like this:
                  </p>
                  <p className='text-[#e5e5e5] text-base'>
                    {activeRecommendation.reason}
                  </p>
                </div>

                <div className='flex justify-between items-center mb-6'>
                  <div>
                    <p className='text-[#999] text-sm'>Publisher</p>
                    <p className='text-[#e5e5e5] font-medium'>
                      {activeRecommendation.brand}
                    </p>
                  </div>
                  <div>
                    <p className='text-[#999] text-sm'>Price</p>
                    <p className='text-[#e5e5e5] text-xl font-bold'>
                      ₹{activeRecommendation.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleGameClick(activeRecommendation._id)}
                className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition-colors w-full'>
                View Game
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Recommendation Indicators */}
        <div className='absolute bottom-4 left-0 right-0 flex justify-center space-x-2'>
          {recommendations.length > 0 &&
            recommendations.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeIndex === index ? 'bg-blue-400 w-6' : 'bg-[#666]'
                }`}
                aria-label={`Go to recommendation ${index + 1}`}
              />
            ))}
        </div>
      </div>

      {/* Mini Recommendation Previews */}
      <div className='mt-6 grid grid-cols-5 gap-2 overflow-x-auto pb-2 hide-scrollbar'>
        {recommendations.length > 0 &&
          recommendations.map((recommendation, index) => (
            <button
              key={recommendation?._id}
              onClick={() => setActiveIndex(index)}
              className={`relative rounded-md overflow-hidden transition-all ${
                activeIndex === index
                  ? 'ring-2 ring-blue-400'
                  : 'opacity-70 hover:opacity-100'
              }`}>
              {console.log(recommendation)}
              <img
                src={recommendation?.images?.[0] || '/placeholder.svg'}
                alt={recommendation?.name}
                className='w-full aspect-video object-cover'
              />
              {activeIndex === index && (
                <div className='absolute inset-0 bg-blue-500/20 flex items-center justify-center'>
                  <div className='rounded-full p-1'>
                    <Sparkles className='w-3 h-3 text-white' />
                  </div>
                </div>
              )}
            </button>
          ))}
      </div>
    </div>
  );
};
