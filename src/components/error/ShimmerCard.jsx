import { Skeleton } from '@/shadcn/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/shadcn/components/ui/card';

export function ShimmerCard() {
  return (
    <Card className='h-[23rem] max-w-[14rem] w-full border-none bg-primary-bg rounded-lg overflow-hidden flex flex-col justify-between'>
      <div className='relative'>
        <Skeleton className='w-full h-[16rem] bg-secondary-bg object-cover rounded-lg mb-4' />
      </div>
      <CardContent className='p-4 text-left'>
        <Skeleton className='h-4 w-1/4 bg-secondary-bg mb-1' />{' '}
        {/* For 'Base Game' text */}
        <Skeleton className='h-6 w-full mb-2 bg-secondary-bg' />{' '}
        {/* For title */}
        <div className='flex justify-between items-center mb-2'>
          <Skeleton className='h-4 w-1/3 bg-secondary-bg' /> {/* Genre */}
          <Skeleton className='h-4 w-1/4 bg-secondary-bg' /> {/* Platform */}
        </div>
      </CardContent>
      <CardFooter className='p-4'>
        <Skeleton className='h-6 w-1/3 bg-secondary-bg' /> {/* Price */}
      </CardFooter>
    </Card>
  );
}
