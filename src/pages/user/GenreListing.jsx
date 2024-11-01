/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { UserPagination } from '@/components/user';
import { GenreCard } from './GenreCard';

export const GenreListing = ({
  title,
  genres,
  currentPage,
  totalPage,
  onPageChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className='bg-[#121212] py-10 sm:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-[#e5e5e5] text-2xl sm:text-3xl font-bold font-poppins flex items-center'>
            {title}
          </h2>
          {currentPage && totalPage && onPageChange && (
            <UserPagination
              totalPages={totalPage}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          )}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5'>
          {genres.map((genre) => (
            <GenreCard
              onClick={() => navigate(`/product/${genre._id}`)}
              key={genre._id}
              genre={genre}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

GenreListing.propTypes = {
  title: PropTypes.string,
  games: PropTypes.array,
};
