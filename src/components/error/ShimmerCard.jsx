import { Skeleton } from '@/shadcn/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/shadcn/components/ui/card';

export function ShimmerCard() {
  return (
    <Card className='min-h-[23rem] max-h-[23rem] w-full border-none bg-primary-bg/50 rounded-lg overflow-hidden flex flex-col justify-between'>
      <div className='relative'>
        <Skeleton className='w-full h-[16rem] bg-secondary-bg/50 object-cover rounded-lg mb-4' />
      </div>
      <CardContent className='p-4 text-left'>
        <Skeleton className='h-4 w-1/4 bg-secondary-bg/50 mb-1' />
        <Skeleton className='h-6 w-full mb-2 bg-secondary-bg/50' />
        <div className='flex justify-between items-center mb-2'>
          <Skeleton className='h-4 w-1/3 bg-secondary-bg/50' />
          <Skeleton className='h-4 w-1/4 bg-secondary-bg/50' />
        </div>
      </CardContent>
      <CardFooter className='p-4'>
        <Skeleton className='h-6 w-1/3 bg-secondary-bg/50' />
      </CardFooter>
    </Card>
  );
}
