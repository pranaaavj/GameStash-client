import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export const GameCard = ({ game, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className='bg-transparent rounded-lg overflow-hidden h-[20rem] sm:h-[22rem] md:h-[23rem] xl:h-[24rem] max-w-full transition-transform duration-300 flex flex-col justify-between cursor-pointer'
      whileHover={{ scale: 1.03 }}>
      <div className='relative'>
        <img
          src={game?.images?.[0]}
          alt={game?.name}
          className='w-full h-[12rem] sm:h-[14rem] md:h-[16rem] xl:h-[17rem] object-cover rounded-lg'
        />

        {game?.bestOffer?.discountValue && (
          <span className='absolute top-2 left-2 bg-accent-blue text-primary-text text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full'>
            -{game?.bestOffer?.discountValue}%
          </span>
        )}
      </div>
      <div className='px-3 sm:px-4 py-2 text-left'>
        <p className='text-secondary-text text-[10px] sm:text-xs mb-1'>
          Base Game
        </p>
        <h3 className='text-primary-text font-bold text-sm sm:text-base mb-1 font-poppins truncate'>
          {game?.name}
        </h3>

        <div className='text-secondary-text text-[10px] sm:text-xs mb-2 flex justify-between items-center'>
          <span>{game?.genre?.name}</span>
          <span>{game?.platform}</span>
        </div>

        <div className='flex justify-start items-center flex-wrap gap-1'>
          {game?.discountedPrice ? (
            <>
              <span className='text-primary-text text-left font-semibold line-through text-[10px] sm:text-xs'>
                ₹{game?.price.toFixed(2)}
              </span>
              <span className='text-accent-blue font-bold text-sm sm:text-base'>
                ₹{game?.discountedPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className='text-primary-text text-left font-bold text-sm sm:text-base'>
              ₹{game?.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

GameCard.propTypes = {
  game: PropTypes.object,
  onClick: PropTypes.func,
};
