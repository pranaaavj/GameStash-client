/* eslint-disable react/prop-types */
import { Button } from '@/shadcn/components/ui/button';

export const EditButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className='bg-accent-green p-0 px-3 hover:bg-hover-green mt-4 text-sm font-semibold uppercase font-sans'>
      Edit
    </Button>
  );
};
