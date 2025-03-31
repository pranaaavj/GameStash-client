// src/pages/user/CartLoading.jsx

export default function CartLoading() {
  return (
    <div className='container mx-auto py-16 max-w-6xl px-4 sm:px-6 lg:px-8'>
      <div className='animate-pulse'>
        <div className='h-8 w-40 bg-secondary-bg/50 rounded mb-10'></div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left - Cart Items */}
          <div className='lg:col-span-2 space-y-6'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='flex gap-4 p-4 bg-secondary-bg/30 rounded-xl'>
                <div className='w-28 h-28 bg-secondary-bg/50 rounded-lg'></div>
                <div className='flex-1 space-y-3'>
                  <div className='h-4 bg-secondary-bg/50 w-3/4 rounded'></div>
                  <div className='h-3 bg-secondary-bg/50 w-1/2 rounded'></div>
                  <div className='flex items-center gap-3 pt-2'>
                    <div className='h-6 w-6 bg-secondary-bg/50 rounded-full'></div>
                    <div className='h-6 w-6 bg-secondary-bg/50 rounded-full'></div>
                    <div className='h-6 w-6 bg-secondary-bg/50 rounded-full'></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Summary Panel */}
          <div className='space-y-4'>
            <div className='h-6 w-40 bg-secondary-bg/50 rounded'></div>
            <div className='h-4 w-3/4 bg-secondary-bg/50 rounded'></div>
            <div className='h-4 w-1/2 bg-secondary-bg/50 rounded'></div>
            <div className='h-4 w-3/5 bg-secondary-bg/50 rounded'></div>
            <div className='h-12 w-full bg-secondary-bg/50 rounded'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
