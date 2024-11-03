import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shadcn/components/ui/alert';
import { Button } from '@/shadcn/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useRouteError } from 'react-router-dom';

export const AdminError = () => {
  const error = useRouteError();

  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return 'An unexpected error occurred';
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md'>
        <Alert
          variant='destructive'
          className='mb-4'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-bold mb-4 text-gray-800'>
            Oops! Something went wrong
          </h2>
          <p className='text-gray-600 mb-6'>
            We apologize for the inconvenience. Our team has been notified and
            is working on resolving the issue.
          </p>
          <div className='space-y-4'>
            <Button
              onClick={() => window.location.reload()}
              className='w-full'>
              Refresh Page
            </Button>
            <Button
              variant='outline'
              onClick={() => window.history.back()}
              className='w-full'>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
