import { Button } from '@/shadcn/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const UserPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className='flex justify-center items-center space-x-2 mt-2'>
      <Button
        variant='outline'
        className='rounded-full text-primary-text bg-secondary-bg w-5 h-auto border-none'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}>
        <ChevronLeft className='h-4 w-4' />
      </Button>
      <Button
        variant='outline'
        className='rounded-full text-primary-text bg-secondary-bg w-5 h-auto border-none'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}>
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
};
