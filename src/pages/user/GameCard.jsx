/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';

export const GameCard = ({ game }) => {
  return (
    <motion.div
      className='bg-transparent rounded-lg shadow-md overflow-hidden max-w-[15rem] transition-transform duration-300'
      whileHover={{ scale: 1.03 }}>
      <div className='relative'>
        <img
          src={game.image}
          alt={game.title}
          className='w-full h-[13rem] object-cover rounded-t-lg'
        />
        {game.discount && (
          <span className='absolute top-2 left-2 bg-accent-blue text-primary-text text-xs font-bold px-2 py-1 rounded-full'>
            -{game.discount}%
          </span>
        )}
      </div>
      <div className='p-3 text-left'>
        {game.baseGame && (
          <p className='text-secondary-text text-xs mb-1'>Base Game</p>
        )}
        <h3 className='text-primary-text font-bold text-base mb-2 font-poppins truncate'>
          {game.title}
        </h3>
        <div className='flex justify-start items-center text-left'>
          {game.discountedPrice ? (
            <>
              <span className='text-primary-text text-left font-semibold mr-2 line-through text-xs'>
                ${game.price.toFixed(2)}
              </span>
              <span className='text-accent-blue font-bold text-base'>
                ${game.discountedPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className='text-primary-text text-left font-bold text-base'>
              ${game.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
