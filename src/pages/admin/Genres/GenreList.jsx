import {
  EditButton,
  ToggleList,
  ReuseableTable,
  AdminPagination,
} from '../../../components/admin';
import {
  useGetAllGenresQuery,
  useToggleGenreListMutation,
} from '@/redux/api/admin/genresApi';

import { Alert, EmptyState } from '@/components/common';
import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';
import { handleApiError, mapTableData, showToast } from '@/utils';
import { ConfirmationModal } from '@/components/common';
import { Link, useNavigate } from 'react-router-dom';
import { Check, CircleX, Plus, X } from 'lucide-react';

export const GenreList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetching data through RTK
  const {
    data: responseGetGenres,
    isSuccess,
    isError,
    error,
  } = useGetAllGenresQuery({
    page: currentPage,
    limit: 6,
  });

  const [
    toggleGenreList,
    { isError: isGenreListError, error: genreListError },
  ] = useToggleGenreListMutation();

  const tableHeaders = ['name', 'description', 'isActive'];

  const actions = [
    ({ id: genreId }) => (
      <EditButton onClick={() => navigate(`/admin/genres/edit/${genreId}`)} />
    ),
    ({ id: genreId, isActive }) => (
      <ToggleList
        onClick={() => handleListingModal(genreId)}
        title={
          isActive ? <X className='h-6 w-6' /> : <Check className='h-6 w-6' />
        }
      />
    ),
  ];

  const handleListingModal = (genreId) => {
    setSelectedGenre(genreId);
    setIsModalOpen(true);
  };

  const handleConfirmListing = async () => {
    try {
      const responseGenreList = await toggleGenreList(selectedGenre).unwrap();

      if (responseGenreList.success) {
        showToast.success(responseGenreList.message);
        () => navigate('/admin/genres');
      }
    } catch (error) {
      handleApiError(error, 'There was some error while listing genre');
    }
  };

  const handleCancelListing = () => {
    setSelectedGenre(null);
    setIsModalOpen(false);
  };

  const tableData = isSuccess
    ? mapTableData(responseGetGenres?.data?.genres, tableHeaders)
    : [];

  if (isError) {
    console.log(error);
  }

  return (
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='mb-6 text-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-primary-text mb-4'>
          Genres
        </h1>
      </div>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0'>
        {/* Search Input */}

        {/* Add Genre Button */}
        <Link to='/admin/genres/add'>
          <Button className='w-full sm:w-auto bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2'>
            <Plus className='mr-2 h-4 w-4' /> Add Genre
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto flex-grow no-scrollbar'>
        {tableData.length ? (
          <ReuseableTable
            headers={tableHeaders}
            data={tableData}
            actions={actions}
          />
        ) : (
          <EmptyState
            Icon={CircleX}
            title='No Genres Found'
            description='No genres found. Please add genres to list here.'
          />
        )}
      </div>

      {/* Pagination */}
      <div className='sticky bottom-0'>
        {responseGetGenres?.data?.totalPages > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={responseGetGenres?.data?.totalPages || 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelListing}
        onConfirm={handleConfirmListing}
        title='Confirm Action'
        description='Are you sure you want to proceed with this action?'
      />
      {isGenreListError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={
            genreListError?.data?.message ||
            'Something went wrong! Please try again.'
          }
        />
      )}
    </div>
  );
};
