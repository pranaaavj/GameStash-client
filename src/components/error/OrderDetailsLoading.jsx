import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/components/ui/card';
import { Skeleton } from '@/shadcn/components/ui/skeleton';

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrderDetailsLoading = () => {
  const navigate = useNavigate();

  return (
    <div className='p-6 md:p-8 text-primary-text'>
      <Button
        variant='ghost'
        onClick={() => navigate('/orders')}
        className='mb-8 flex items-center gap-2 hover:bg-secondary-bg/20 text-primary-text'>
        <ArrowLeft className='h-4 w-4' /> Back to Orders
      </Button>

      <Card className='bg-secondary-bg/20 shadow-md border-none rounded-xl'>
        <CardHeader>
          <div className='flex justify-between'>
            <Skeleton className='h-8 w-48 bg-secondary-bg/50' />
            <Skeleton className='h-8 w-32 bg-secondary-bg/50' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <Skeleton className='h-24 w-full bg-secondary-bg/50' />
            <Skeleton className='h-48 w-full bg-secondary-bg/50' />
            <Skeleton className='h-32 w-full bg-secondary-bg/50' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
