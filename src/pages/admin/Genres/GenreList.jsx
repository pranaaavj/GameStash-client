import { useState } from 'react';
import {
  useGetAllGenresQuery,
  useToggleGenreListMutation,
} from '@/redux/api/admin/genresApi';
import { AdminPagination } from '@/components/admin';
import { ConfirmationModal, EmptyState } from '@/components/common';
import { handleApiError, showToast } from '@/utils';
import { Button } from '@/shadcn/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/ui/card';
import { Badge } from '@/shadcn/components/ui/badge';
import { Plus, X, Check, CircleX, ListMusic } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { ContainerLoading } from '@/components/error';

export const GenreList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: responseGetGenres, isLoading } = useGetAllGenresQuery({
    page: currentPage,
    limit: 6,
  });

  const [toggleGenreList] = useToggleGenreListMutation();

  const genres = responseGetGenres?.data?.genres || [];

  const handleListingModal = (genreId) => {
    setSelectedGenreId(genreId);
    setIsModalOpen(true);
  };

  const handleConfirmListing = async () => {
    try {
      const res = await toggleGenreList(selectedGenreId).unwrap();
      if (res.success) {
        showToast.success(res.message);
      }
      setIsModalOpen(false);
    } catch (err) {
      handleApiError(err, 'There was some error while listing genre');
    }
  };

  const handleCancelListing = () => {
    setSelectedGenreId(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <ContainerLoading />;
  }

  return (
    <Card className='w-full h-full shadow-sm border-0 bg-secondary-bg'>
      <CardHeader className='pb-0'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <CardTitle className='text-2xl font-medium text-primary-text flex items-center gap-2'>
            <ListMusic className='h-5 w-5' />
            Genres
          </CardTitle>

          <Link to='/admin/genres/add'>
            <Button className='bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2'>
              <Plus className='mr-2 h-4 w-4' />
              Add Genre
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='w-full space-y-4'>
          {genres.length ? (
            <div className='grid gap-4'>
              {genres.map((genre) => (
                <Card
                  key={genre._id}
                  className='overflow-hidden border-0 shadow-sm hover:shadow transition-shadow bg-primary-bg/20'>
                  <CardContent className='p-0'>
                    <div className='flex flex-col md:flex-row justify-between p-4 gap-4 md:items-center'>
                      {/* Left: Genre Name + Description */}
                      <div className='min-w-[200px]'>
                        <p className='font-medium text-primary-text'>
                          {genre.name}
                        </p>
                        <p className='text-sm text-secondary-text line-clamp-2'>
                          {genre.description}
                        </p>
                      </div>

                      {/* Right: Badges + Buttons */}
                      <div className='ml-auto flex flex-col md:flex-row items-center gap-4'>
                        <div className='flex gap-2'>
                          <Badge
                            variant={genre.isActive ? 'default' : 'secondary'}
                            className={`w-[110px] h-10 text-xs truncate text-center justify-center items-center flex ${
                              genre.isActive
                                ? 'bg-green-500/20 text-green-600'
                                : 'bg-red-500/20 text-red-600'
                            }`}>
                            {genre.isActive ? 'Listed' : 'Unlisted'}
                          </Badge>
                        </div>

                        <div className='flex items-center gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-blue-600 hover:bg-accent-blue/10'
                            onClick={() =>
                              navigate(`/admin/genres/edit/${genre._id}`)
                            }>
                            Edit
                          </Button>

                          <Button
                            variant='ghost'
                            size='sm'
                            className={`min-w-[100px] justify-center ${
                              genre.isActive
                                ? 'text-red-600 hover:bg-hover-red'
                                : 'text-green-600 hover:bg-hover-green'
                            }`}
                            onClick={() => handleListingModal(genre._id)}>
                            {genre.isActive ? (
                              <>
                                <X className='h-4 w-4 mr-1' /> Unlist
                              </>
                            ) : (
                              <>
                                <Check className='h-4 w-4 mr-1' /> List
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CircleX}
              title='No Genres Found'
              description='No genres found. Please add genres to list here.'
            />
          )}
        </div>

        <div className='mt-6 flex justify-center'>
          {responseGetGenres?.data?.totalPages > 1 && (
            <AdminPagination
              currentPage={currentPage}
              totalPages={responseGetGenres?.data?.totalPages || 0}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </CardContent>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelListing}
        onConfirm={handleConfirmListing}
        title='Confirm Action'
        description='Are you sure you want to proceed with this action?'
      />
    </Card>
  );
};
