import { ShimmerCard } from './ShimmerCard';

export const GameLoading = ({ count = 5, title, hasPagination }) => {
  return (
    <div className='bg-transparent py-4 sm:py-7'>
      <div className='max-w-7xl mx-auto px-4 sm:px-7 bg-transparent'>
        <div className='flex flex-wrap justify-between items-center gap-y-3 mb-6 sm:mb-8'>
          {title && (
            <div className='flex items-center'>
              <div className='h-8 sm:h-9 md:h-10 w-32 sm:w-40 md:w-48 bg-secondary-bg/50 rounded' />
            </div>
          )}

          {hasPagination && (
            <div className='h-8 w-32 sm:w-40 bg-secondary-bg/50 rounded' />
          )}
        </div>

        <div className='grid gap-4 sm:gap-5 xl:gap-6 pb-4 lg:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: count }).map((_, idx) => (
            <div
              key={idx}
              className='w-full'>
              <div className='bg-primary-bg/80 backdrop-blur-md rounded-xl'>
                <ShimmerCard />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
