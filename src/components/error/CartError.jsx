// src/pages/user/CartError.jsx
import { Button } from '@/shadcn/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export default function CartError() {
  const navigate = useNavigate();

  return (
    <div className='min-h-[60vh] flex items-center justify-center text-center'>
      <div className='bg-secondary-bg/30 p-6 rounded-xl max-w-md w-full shadow-md'>
        <div className='flex flex-col items-center gap-4'>
          <div className='bg-accent-red/10 p-4 rounded-full'>
            <AlertCircle className='w-8 h-8 text-accent-red' />
          </div>
          <h2 className='text-lg sm:text-xl font-semibold text-primary-text'>
            Failed to load your cart
          </h2>
          <p className='text-sm text-secondary-text'>
            Something went wrong while loading your cart. Please try again or
            check your internet connection.
          </p>
          <Button
            onClick={() => navigate('/')}
            variant='outline'
            className='text-accent-red border-accent-red hover:bg-hover-red hover:text-white flex gap-2'>
            <Home className='w-4 h-4' /> Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
