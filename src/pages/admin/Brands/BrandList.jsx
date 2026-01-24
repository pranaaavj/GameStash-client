import { useState } from 'react';
import {
  useGetAllBrandsQuery,
  useToggleBrandListMutation,
} from '@/redux/api/admin/brandsApi';
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
import { Plus, X, Check, Tags } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { ContainerLoading } from '@/components/error';

export const BrandList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: responseGetBrands, isLoading } = useGetAllBrandsQuery({
    page: currentPage,
    limit: 6,
  });

  const [toggleBrandList] = useToggleBrandListMutation();

  const brands = responseGetBrands?.data?.brands || [];

  const handleListingModal = (brandId) => {
    setSelectedBrandId(brandId);
    setIsModalOpen(true);
  };

  const handleConfirmListing = async () => {
    try {
      const res = await toggleBrandList(selectedBrandId).unwrap();
      if (res.success) {
        showToast.success(res.message);
      }
      setIsModalOpen(false);
    } catch (err) {
      handleApiError(err, 'There was some error listing brand');
    }
  };

  const handleCancelListing = () => {
    setSelectedBrandId(null);
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
            <Tags className='h-5 w-5' />
            Brands
          </CardTitle>

          <Link to='/admin/brands/add'>
            <Button className='bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2'>
              <Plus className='mr-2 h-4 w-4' />
              Add Brand
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className='p-6'>
        <div className='w-full space-y-4'>
          {brands.length ? (
            <div className='grid gap-4'>
              {brands.map((brand) => (
                <Card
                  key={brand._id}
                  className='overflow-hidden border-0 shadow-sm hover:shadow transition-shadow bg-primary-bg/20'>
                  <CardContent className='p-0'>
                    <div className='flex flex-col md:flex-row justify-between p-4 gap-4 md:items-center'>
                      {/* Left: Brand Name + Description */}
                      <div className='min-w-[200px]'>
                        <p className='font-medium text-primary-text'>
                          {brand.name}
                        </p>
                        <p className='text-sm text-secondary-text line-clamp-2'>
                          {brand.description}
                        </p>
                      </div>

                      {/* Right: Badges + Buttons */}
                      <div className='ml-auto flex flex-col md:flex-row items-center gap-4'>
                        <div className='flex gap-2'>
                          <Badge
                            variant={brand.isActive ? 'default' : 'secondary'}
                            className={`w-[110px] h-10 text-xs truncate text-center justify-center items-center flex ${
                              brand.isActive
                                ? 'bg-green-500/20 text-green-600'
                                : 'bg-red-500/20 text-red-600'
                            }`}>
                            {brand.isActive ? 'Listed' : 'Unlisted'}
                          </Badge>
                        </div>

                        <div className='flex items-center gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-blue-600 hover:bg-accent-blue/10'
                            onClick={() =>
                              navigate(`/admin/brands/edit/${brand._id}`)
                            }>
                            Edit
                          </Button>

                          <Button
                            variant='ghost'
                            size='sm'
                            className={`min-w-[100px] justify-center ${
                              brand.isActive
                                ? 'text-red-600 hover:bg-hover-red'
                                : 'text-green-600 hover:bg-hover-green'
                            }`}
                            onClick={() => handleListingModal(brand._id)}>
                            {brand.isActive ? (
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
              icon={Tags}
              title='No Brands Found'
              description='No brands found. Please add a brand to list it here.'
            />
          )}
        </div>

        <div className='mt-6 flex justify-center'>
          {responseGetBrands?.data?.totalPages > 1 && (
            <AdminPagination
              currentPage={currentPage}
              totalPages={responseGetBrands?.data?.totalPages || 0}
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
