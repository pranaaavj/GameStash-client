import { Card, CardContent, CardHeader } from '@/shadcn/components/ui/card';
import { Skeleton } from '@/shadcn/components/ui/skeleton';

export const OrdersListLoading = () => {
  return (
    <div className='p-6 md:p-8 text-primary-text'>
      <h1 className='text-3xl font-bold mb-8'>Your Orders</h1>
      <div className='space-y-6'>
        {[1, 2].map((i) => (
          <Card
            key={i}
            className='bg-secondary-bg/20 shadow-md border-none rounded-xl'>
            <CardHeader className='pb-2'>
              <div className='flex justify-between'>
                <Skeleton className='h-6 w-32 bg-secondary-bg/50' />
                <Skeleton className='h-6 w-24 bg-secondary-bg/50' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <div className='flex gap-4'>
                    <Skeleton className='h-16 w-16 rounded-lg bg-secondary-bg/50' />
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-40 bg-secondary-bg/50' />
                      <Skeleton className='h-4 w-20 bg-secondary-bg/50' />
                    </div>
                  </div>
                  <Skeleton className='h-6 w-16 bg-secondary-bg/50' />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
