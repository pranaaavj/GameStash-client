export const GameBrowserLoading = () => (
  <div className='rounded-xl overflow-hidden bg-secondary-bg/30 animate-pulse'>
    <div className='h-48 bg-secondary-bg/50'></div>
    <div className='p-4 space-y-3'>
      <div className='h-4 bg-secondary-bg/50 rounded w-3/4'></div>
      <div className='h-4 bg-secondary-bg/50 rounded w-1/2'></div>
      <div className='h-6 bg-secondary-bg/50 rounded w-1/3 mt-2'></div>
    </div>
  </div>
);
