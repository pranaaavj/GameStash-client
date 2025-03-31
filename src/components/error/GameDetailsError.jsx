/* eslint-disable react/prop-types */
import { Button } from '@/shadcn/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GameDetailsError = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className='mt-20 bg-primary-bg text-primary-text font-sans flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-secondary-bg/30 rounded-xl p-6 sm:p-8 shadow-lg'>
        <div className='flex flex-col items-center text-center'>
          <div className='bg-accent-red/10 p-3 rounded-full mb-4'>
            <AlertCircle className='h-8 w-8 text-accent-red' />
          </div>

          <h2 className='text-xl sm:text-2xl font-bold mb-2'>
            Failed to Load Game Details
          </h2>

          <p className='text-secondary-text mb-6'>
            We encountered an error while trying to load the game information.
            This could be due to a network issue or the game may no longer be
            available.
          </p>

          <div className='space-y-3 w-full'>
            <Button
              variant='outline'
              onClick={() => navigate('/')}
              className='w-full bg-accent-red border-none text-white hover:bg-hover-red hover:text-white flex items-center justify-center gap-2'>
              <Home className='h-4 w-4' />
              Return to Home
            </Button>
          </div>

          <div className='mt-6 text-xs text-secondary-text border-t border-gray-800 pt-4 w-full'>
            <p>
              Error details: {error?.data?.message || 'Unknown error occurred'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
