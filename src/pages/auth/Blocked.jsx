import { AlertOctagon } from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';

export const Blocked = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-primary-bg text-primary-foreground'>
      <div className='text-center'>
        <AlertOctagon className='mx-auto mb-6 h-16 w-16 text-destructive' />
        <h1 className='mb-4 font-poppins text-4xl font-bold'>Access Denied</h1>
        <p className='mb-8 text-lg text-muted-foreground'>
          Your account has been restricted. Please contact support if you
          believe this is a mistake.
        </p>
        <Button className='px-6 py-2'>Contact Support</Button>
      </div>
    </div>
  );
};
