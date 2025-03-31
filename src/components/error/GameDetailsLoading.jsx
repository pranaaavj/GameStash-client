import { Card, CardContent } from '@/shadcn/components/ui/card';

export const GameDetailsLoading = () => {
  return (
    <div className='min-h-screen bg-primary-bg text-primary-text font-sans select-none'>
      <div className='container mx-auto py-6 sm:py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10'>
          {/* Left Column */}
          <div className='space-y-4 sm:space-y-6'>
            <div>
              {/* Title shimmer */}
              <div className='h-8 sm:h-10 bg-secondary-bg/50 rounded-lg w-3/4 mb-2 sm:mb-3 animate-pulse'></div>
              <div className='my-4 flex items-center'>
                {/* Rating shimmer */}
                <div className='flex gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className='w-4 h-4 bg-secondary-bg/50 rounded-full animate-pulse'></div>
                  ))}
                </div>
                <div className='ml-2 h-4 bg-secondary-bg/50 rounded w-24 animate-pulse'></div>
              </div>
            </div>

            <div className='w-full transition-all duration-300 overflow-hidden'>
              <div className='flex gap-3 sm:gap-4 flex-col sm:flex-row'>
                <div className='flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible'>
                  {/* Thumbnail shimmers */}
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className='w-14 h-14 sm:w-16 sm:h-16 p-1 rounded-lg shadow-sm bg-secondary-bg/30 animate-pulse'></div>
                  ))}
                </div>

                {/* Main Image Card shimmer */}
                <Card className='relative overflow-hidden rounded-xl w-full shadow-lg aspect-square border-0 bg-secondary-bg/30 animate-pulse'>
                  <CardContent className='p-0 w-full h-full'>
                    <div className='relative w-full h-full'>
                      {/* Navigation Buttons shimmer */}
                      <div className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-secondary-bg/50 rounded-full p-2 w-9 h-9'></div>
                      <div className='absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-secondary-bg/50 rounded-full p-2 w-9 h-9'></div>
                    </div>

                    <div className='flex justify-center gap-2 mt-3 sm:mt-4 pb-4'>
                      {/* Dot indicators shimmer */}
                      {[...Array(4)].map((_, index) => (
                        <div
                          key={index}
                          className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-secondary-bg/50'
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column - Game Info and Action Buttons */}
          <div className='ml-0 md:ml-4 lg:ml-6 mt-6 lg:mt-10 space-y-6'>
            <div className='bg-secondary-bg/30 px-4 py-5 sm:px-5 sm:py-6 rounded-xl'>
              <div className='flex items-baseline gap-2 sm:gap-3 mb-2'>
                {/* Price shimmer */}
                <div className='h-8 bg-secondary-bg/50 rounded w-24 animate-pulse'></div>
                <div className='h-6 bg-secondary-bg/50 rounded w-16 animate-pulse'></div>
                <div className='h-6 bg-secondary-bg/50 rounded w-12 animate-pulse'></div>
              </div>

              {/* Stock shimmer */}
              <div className='h-4 bg-secondary-bg/50 rounded w-40 mt-3 animate-pulse'></div>
            </div>

            <div className='flex items-center space-x-4'>
              <div className='h-6 bg-secondary-bg/50 rounded w-20 animate-pulse'></div>
              <div className='flex items-center'>
                {/* Quantity controls shimmer */}
                <div className='h-8 w-8 rounded-full bg-secondary-bg/50 animate-pulse'></div>
                <div className='mx-4 h-6 w-6 bg-secondary-bg/50 rounded animate-pulse'></div>
                <div className='h-8 w-8 rounded-full bg-secondary-bg/50 animate-pulse'></div>
              </div>
            </div>

            {/* Additional space for message */}
            <div className='min-h-[1.5rem]'></div>

            <div className='space-y-3'>
              {/* Buttons shimmer */}
              <div className='w-full h-12 bg-secondary-bg/50 rounded-md animate-pulse'></div>
              <div className='w-full h-12 bg-secondary-bg/50 rounded-md animate-pulse'></div>
              <div className='w-full h-12 bg-secondary-bg/50 rounded-md animate-pulse'></div>
            </div>

            <div className='space-y-4 pt-4 border-t border-gray-800'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-3'>
                  <div className='flex flex-col'>
                    <div className='h-4 bg-secondary-bg/50 rounded w-12 mb-1 animate-pulse'></div>
                    <div className='h-5 bg-secondary-bg/50 rounded w-24 animate-pulse'></div>
                  </div>
                  <div className='flex flex-col'>
                    <div className='h-4 bg-secondary-bg/50 rounded w-16 mb-1 animate-pulse'></div>
                    <div className='h-5 bg-secondary-bg/50 rounded w-20 animate-pulse'></div>
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='flex flex-col'>
                    <div className='h-4 bg-secondary-bg/50 rounded w-12 mb-1 animate-pulse'></div>
                    <div className='h-5 bg-secondary-bg/50 rounded w-24 animate-pulse'></div>
                  </div>
                  <div className='flex flex-col'>
                    <div className='h-4 bg-secondary-bg/50 rounded w-20 mb-1 animate-pulse'></div>
                    <div className='h-5 bg-secondary-bg/50 rounded w-28 animate-pulse'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Game Details, Description, System Requirements, Reviews */}
        <div className='mt-16 space-y-12'>
          <div className='bg-secondary-bg/20 p-6 rounded-xl'>
            <div className='h-8 bg-secondary-bg/50 rounded w-40 mb-4 animate-pulse'></div>
            {/* Description shimmer */}
            <div className='space-y-2'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='h-4 bg-secondary-bg/50 rounded w-full animate-pulse'></div>
              ))}
            </div>
          </div>

          <div className='bg-secondary-bg/20 p-6 rounded-xl'>
            <div className='h-8 bg-secondary-bg/50 rounded w-56 mb-4 animate-pulse'></div>
            {/* System requirements shimmer */}
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className='h-4 bg-secondary-bg/50 rounded w-full animate-pulse'></div>
                ))}
              </div>
              <div className='space-y-2'>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className='h-4 bg-secondary-bg/50 rounded w-full animate-pulse'></div>
                ))}
              </div>
            </div>
          </div>

          <div className='bg-secondary-bg/20 p-6 rounded-xl'>
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center gap-3'>
                <div className='h-8 bg-secondary-bg/50 rounded w-24 animate-pulse'></div>
                <div className='h-6 bg-secondary-bg/50 rounded w-32 animate-pulse'></div>
              </div>
              <div className='h-10 bg-secondary-bg/50 rounded w-36 animate-pulse'></div>
            </div>

            {/* Reviews shimmer */}
            <div className='space-y-6'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='border border-secondary-bg/30 rounded-lg p-4'>
                  <div className='flex justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <div className='w-10 h-10 rounded-full bg-secondary-bg/50 animate-pulse'></div>
                      <div className='h-5 bg-secondary-bg/50 rounded w-32 animate-pulse'></div>
                    </div>
                    <div className='h-4 bg-secondary-bg/50 rounded w-24 animate-pulse'></div>
                  </div>
                  <div className='space-y-2 mt-3'>
                    {[...Array(2)].map((_, j) => (
                      <div
                        key={j}
                        className='h-4 bg-secondary-bg/50 rounded w-full animate-pulse'></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
