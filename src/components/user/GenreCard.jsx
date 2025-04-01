import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export const GenreCard = ({ genre, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className='bg-transparent rounded-lg overflow-hidden h-[15rem] max-w-[14rem] transition-transform duration-300 flex flex-col justify-between'
      whileHover={{ scale: 1.03 }}>
      <div className='relative'>
        <img
          src={genre.image}
          alt={genre.name}
          className='w-full h-[10rem] object-cover rounded-lg'
        />
      </div>
      <div className='p-4 text-left'>
        <h3 className='text-primary-text font-bold text-base mb-1 font-poppins truncate'>
          {genre.name}
        </h3>
        <p className='text-secondary-text text-xs mb-2'>
          {genre.gamesCount} Games
        </p>
      </div>
    </motion.div>
  );
};

GenreCard.propTypes = {
  genre: PropTypes.object,
  onClick: PropTypes.func,
};
