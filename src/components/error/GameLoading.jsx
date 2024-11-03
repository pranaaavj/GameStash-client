import PropTypes from 'prop-types';
import { ShimmerCard } from './ShimmerCard';

export const GameLoading = ({ count = 5 }) => (
  <div className='grid grid-cols-1 my-16 sm:grid-cols-2 lg:grid-cols-5 gap-5 w-full h-full'>
    {Array.from({ length: count }).map((_, idx) => (
      <ShimmerCard key={idx} />
    ))}
  </div>
);

GameLoading.propTypes = {
  count: PropTypes.number,
};
