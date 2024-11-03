import { Button } from '@/shadcn/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const RelatedGamesFallback = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center p-6 text-center bg-secondary-bg rounded-lg shadow-lg'>
      <h2 className='text-2xl font-semibold text-primary-text mb-4'>
        No Related Games Found
      </h2>
      <p className='text-secondary-text mb-6'>
        We couldn&apos;t find any games related to this one. But there are
        plenty more to explore!
      </p>
      <Button
        onClick={() => navigate('/games')}
        className='bg-accent-red hover:bg-hover-red text-white py-2 px-6 rounded-full font-medium'>
        Browse All Games
      </Button>
    </div>
  );
};
