import { Button } from '@/shadcn/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrderDetailsError = () => {
  const navigate = useNavigate();

  return (
    <div className='p-6 md:p-8 text-primary-text'>
      <Button
        variant='ghost'
        onClick={() => navigate('/orders')}
        className='mb-8 flex items-center gap-2 hover:bg-secondary-bg/20 text-primary-text'>
        <ArrowLeft className='h-4 w-4' /> Back to Orders
      </Button>

      <div className='bg-secondary-bg/20 rounded-xl p-5 flex items-center gap-3 shadow-md border-none'>
        <AlertCircle className='h-5 w-5 text-red-500' />
        <p className='text-red-500'>
          Error loading order details. Please try again later.
        </p>
      </div>
    </div>
  );
};
