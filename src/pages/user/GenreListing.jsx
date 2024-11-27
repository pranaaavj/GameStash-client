/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { UserPagination } from '@/components/user';

export const GenreCard = ({ genre, onClick }) => {
  return (
    <div
      onClick={onClick}
      className='cursor-pointer group relative w-full h-40 flex items-center justify-center rounded-lg bg-[#1E1E1E] hover:bg-[#2A2A2A] transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105'>
      <h3 className='text-white text-lg sm:text-3xl font-semibold capitalize transition-opacity duration-300 group-hover:opacity-90'>
        {genre.name}
      </h3>
    </div>
  );
};

export const GenreListing = ({
  title,
  genres,
  currentPage,
  totalPage,
  onPageChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className='bg-primary-bg py-5 sm:py-10'>
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
              onClick={() => navigate(`/game?genre=${genre._id}`)}
              key={genre._id}
              genre={genre}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
