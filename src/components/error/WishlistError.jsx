import { AlertCircle } from 'lucide-react';
import { Button } from 'react-day-picker';

export const WishlistError = ({ refetch }) => {
  return (
    <div className='container mx-auto px-4 py-10 max-w-6xl'>
      <h1 className='text-3xl md:text-4xl font-bold mb-10 text-primary-text'>
        Your Wishlist
      </h1>
      <div className='bg-secondary-bg/60 p-6 rounded-xl'>
        <div className='flex items-center gap-3 text-accent-red'>
          <AlertCircle className='h-5 w-5' />
          <p>
            There was an error loading your wishlist. Please try again later.
          </p>
        </div>
        <Button
          className='mt-4 bg-accent-blue hover:bg-hover-blue text-white'
          onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    </div>
  );
};
