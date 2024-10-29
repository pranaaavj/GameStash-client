import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export const GameCard = ({ game }) => {
  console.log(game);
  return (
    <motion.div
      className='bg-transparent rounded-lg overflow-hidden h-[23rem] max-w-[14rem] transition-transform duration-300 flex flex-col justify-between'
      whileHover={{ scale: 1.03 }}>
      <div className='relative'>
        <img
          src={game.images[0]}
          alt={game.name}
          className='w-full h-[16rem] object-cover rounded-lg'
        />
        {/* For discount section  */}
        {/* {game.discount && (
          <span className='absolute top-2 left-2 bg-accent-blue text-primary-text text-xs font-bold px-2 py-1 rounded-full'>
            -{game.discount}%
          </span>
        )} */}
      </div>
      <div className='p-4 text-left'>
        {<p className='text-secondary-text text-xs mb-1'>Base Game</p>}
        <h3 className='text-primary-text font-bold text-base mb-1 font-poppins truncate'>
          {game.name}
        </h3>

        {/* Display Genre and Platform */}
        <div className='text-secondary-text text-xs mb-2 flex justify-between items-center'>
          <span>{game.genre?.name}</span>
          <span className='text-secondary-text'>{game.platform}</span>
        </div>

        <div className='flex justify-start items-center'>
          {/* For discount section */}

          {/* {game.discountedPrice ? (
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
          )} */}
          <span className='text-primary-text font-bold text-base'>
            ${game.price.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

GameCard.propTypes = {
  game: PropTypes.object,
};
