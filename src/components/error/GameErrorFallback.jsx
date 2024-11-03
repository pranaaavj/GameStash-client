import PropTypes from 'prop-types';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX, RefreshCw } from 'lucide-react';

export const GameErrorFallback = ({ message, onRetry }) => (
  <div className='flex flex-col items-center justify-center h-full w-full bg-secondary-bg p-6 rounded-lg shadow-md text-center'>
    <CircleX className='text-red-500 h-12 w-12 mb-4' />
    <h2 className='text-lg font-semibold text-red-600'>
      {message || 'Oops! Unable to load games at the moment.'}
    </h2>
    <p className='text-primary-500 mt-2'>
      There was an issue fetching the games. Please try again later.
    </p>
    {onRetry && (
      <Button
        onClick={onRetry}
        className='mt-4 bg-accent-red text-white hover:bg-hover-red'>
        <RefreshCw className='h-5 w-5 mr-2' />
        Retry
      </Button>
    )}
  </div>
);

GameErrorFallback.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};
