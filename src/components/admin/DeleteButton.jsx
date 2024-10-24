/* eslint-disable react/prop-types */
import { Button } from '@/shadcn/components/ui/button';

export const DeleteButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className='bg-accent-red p-0 px-3 hover:bg-hover-red mt-4 text-sm font-semibold uppercase font-sans'>
      Delete
    </Button>
  );
};
