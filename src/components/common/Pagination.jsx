import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/shadcn/components/ui/pagination';
import PropTypes from 'prop-types';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const maxVisiblePages = 5; // Number of visible pages at once
  let pageNumbers = [];

  const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <ShadPagination className='mt-10'>
      <PaginationContent className='flex justify-center space-x-2'>
        <PaginationItem>
          {
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={`cursor-pointer ${
                currentPage === 1 ? 'invisible' : 'visible'
              }`}
            />
          }
        </PaginationItem>
        {/* Page Numbers */}
        {startPage > 1 && <PaginationEllipsis />}
        {pageNumbers.map((number) => (
          <PaginationItem
            key={number}
            onClick={() => onPageChange(number)}
            className={`cursor-pointer hover:bg-white hover:text-black px-3 py-1 rounded-lg transition-colors duration-200 ${
              currentPage === number ? 'bg-primary-text text-black' : ''
            }`}>
            {number}
          </PaginationItem>
        ))}
        {endPage < totalPages && <PaginationEllipsis />}
        <PaginationItem>
          {
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={`cursor-pointer ${
                currentPage === totalPages ? 'invisible' : 'visible'
              }`}
            />
          }
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
};
