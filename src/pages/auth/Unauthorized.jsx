import { AlertTriangle } from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 z-50 flex min-h-screen items-center justify-center bg-primary-bg text-primary-foreground'>
      <div className='text-center'>
        <AlertTriangle className='mx-auto mb-6 h-16 w-16 text-destructive' />
        <h1 className='mb-4 font-poppins text-4xl font-bold'>
          Unauthorized Access
        </h1>
        <p className='mb-8 text-lg text-muted-foreground'>
          You do not have permission to view this page. Please log in with an
          authorized account.
        </p>
        <Button
          onClick={() => navigate(-1)}
          className='px-6 py-2'>
          Go Back
        </Button>
      </div>
    </div>
  );
};
