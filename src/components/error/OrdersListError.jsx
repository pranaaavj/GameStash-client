import { AlertCircle } from 'lucide-react';

export const OrdersListError = () => {
  return (
    <div className='p-6 md:p-8 text-primary-text'>
      <div className='bg-[#3A1C1C] rounded-lg p-5 flex items-center gap-3'>
        <AlertCircle className='h-5 w-5 text-red-500' />
        <p className='text-red-500'>
          Error loading orders. Please try again later.
        </p>
      </div>
    </div>
  );
};
