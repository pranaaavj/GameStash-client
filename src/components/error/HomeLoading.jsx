import { Skeleton } from '@/shadcn/components/ui/skeleton';

export function HomeLoading() {
  return (
    <div className='min-h-screen bg-primary-bg text-primary-text font-sans animate-pulse'>
      {/* Hero Section */}
      <div className='flex flex-col lg:flex-row gap-6 my-10 px-4 lg:px-10'>
        {/* Main Banner */}
        <div className='flex-1 min-h-[300px] h-[400px] rounded-2xl overflow-hidden'>
          <Skeleton className='w-full h-full rounded-2xl' />
        </div>

        {/* Side Thumbnail List */}
        <div className='w-full lg:w-[250px] space-y-4'>
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className='flex items-center gap-3'>
              <Skeleton className='w-12 h-16 rounded-md' />
              <Skeleton className='h-4 w-32 rounded' />
            </div>
          ))}
        </div>
      </div>

      {/* Section Loader */}
      {['Latest Games', 'Top Rated Games', 'Discounted Games'].map(
        (section, sidx) => (
          <div
            key={sidx}
            className='my-10 px-4 lg:px-10'>
            <div className='h-6 w-40 mb-6'>
              <Skeleton className='h-6 w-40' />
            </div>

            {/* Grid Loader */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className='space-y-3'>
                  <Skeleton className='w-full h-[200px] rounded-xl' />
                  <Skeleton className='w-2/3 h-4 rounded' />
                  <Skeleton className='w-1/2 h-3 rounded' />
                  <Skeleton className='w-1/4 h-3 rounded' />
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
