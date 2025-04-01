import { Button } from '@/shadcn/components/ui/button';
import { Edit } from 'lucide-react';

export const EditButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className='bg-accent-blue p-0 px-3 hover:bg-hover-blue mt-4 text-sm transition font-semibold uppercase font-sans'>
      <Edit className='h-4 w-4' />
    </Button>
  );
};
