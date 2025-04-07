import { Card, CardContent } from '@/shadcn/components/ui/card';

export const AddressLoading = () => {
  return (
    <div className='bg-secondary-bg/50 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4 sm:p-6'>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className='bg-primary-bg/60 border border-none text-primary-text shadow-md rounded-xl animate-pulse'>
          <CardContent className='p-4 space-y-4'>
            <div className='h-5 bg-secondary-bg/50 rounded w-2/3' />
            <div className='h-4 bg-secondary-bg/50 rounded w-full' />
            <div className='h-4 bg-secondary-bg/50 rounded w-5/6' />
            <div className='h-4 bg-secondary-bg/50 rounded w-2/3' />
            <div className='h-4 bg-secondary-bg/50 rounded w-1/2' />
            <div className='flex justify-end gap-2 pt-2'>
              <div className='h-8 w-8 bg-secondary-bg/50 rounded-full' />
              <div className='h-8 w-8 bg-secondary-bg/50 rounded-full' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
