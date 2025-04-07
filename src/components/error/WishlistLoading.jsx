export const WishlistLoading = () => {
  return (
    <div className='container mx-auto px-4 py-10 max-w-full'>
      <h1 className='text-3xl md:text-4xl font-bold mb-10 text-primary-text'>
        Your Wishlist
      </h1>
      <div className='space-y-6'>
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className='bg-secondary-bg/50 p-5 md:p-6 rounded-xl animate-pulse'>
            <div className='flex gap-6'>
              <div className='h-28 w-28 md:h-32 md:w-32 rounded-lg bg-primary-bg/50'></div>
              <div className='flex-1 space-y-4'>
                <div className='h-6 bg-primary-bg/50 rounded w-3/4'></div>
                <div className='h-4 bg-primary-bg/50 rounded w-1/4'></div>
                <div className='h-4 bg-primary-bg/50 rounded w-1/2'></div>
                <div className='flex justify-between'>
                  <div className='h-8 bg-primary-bg/50 rounded w-1/3'></div>
                  <div className='h-8 bg-primary-bg/50 rounded w-1/4'></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
