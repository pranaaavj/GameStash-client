import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AIRecommendationCard = ({ recommendation }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games/${recommendation._id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      className='relative bg-[#1a1a1a] rounded-lg overflow-hidden h-full transition-all duration-300 flex flex-col cursor-pointer group'
      whileHover={{
        scale: 1.03,
        boxShadow: '0 10px 30px -10px rgba(0, 0, 255, 0.2)',
      }}>
      {/* AI Badge */}
      <div className='absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#2a2a2a]/80 backdrop-blur-sm px-2 py-1 rounded-full'>
        <Sparkles className='w-3 h-3 text-blue-400' />
        <span className='text-[10px] font-medium text-blue-400'>AI Pick</span>
      </div>

      {/* Score Badge */}
      <div className='absolute top-3 right-3 z-10'>
        <div className='bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
          {recommendation.score.toFixed(1)}
        </div>
      </div>

      {/* Game Image */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-[1]' />
        <img
          src={recommendation.images?.[0] || '/placeholder.svg'}
          alt={recommendation.name}
          className='w-full h-[12rem] sm:h-[14rem] md:h-[16rem] object-cover transition-transform duration-500 group-hover:scale-110'
        />
      </div>

      {/* Game Info */}
      <div className='flex-1 flex flex-col justify-between p-4'>
        <div>
          <div className='flex justify-between items-start mb-2'>
            <h3 className='text-[#e5e5e5] font-bold text-sm sm:text-base line-clamp-2'>
              {recommendation.name}
            </h3>
          </div>

          <div className='flex justify-between text-[#999] text-xs mb-3'>
            <span>{recommendation.genre}</span>
            <span>{recommendation.platform}</span>
          </div>

          {/* Reason */}
          <p className='text-[#999] text-xs italic mb-4 line-clamp-2'>
            {recommendation.reason}
          </p>
        </div>

        {/* Price */}
        <div className='text-[#e5e5e5] font-bold text-base'>
          ₹{recommendation.price.toFixed(2)}
        </div>
      </div>
    </motion.div>
  );
};
