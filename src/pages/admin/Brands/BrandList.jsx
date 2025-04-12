import {
  EditButton,
  ToggleList,
  ReuseableTable,
  AdminPagination,
} from '../../../components/admin';
import {
  useGetAllBrandsQuery,
  useToggleBrandListMutation,
} from '@/redux/api/admin/brandsApi';

import { Alert, EmptyState } from '@/components/common';
import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';
import { handleApiError, mapTableData, showToast } from '@/utils';
import { ConfirmationModal } from '@/components/common';
import { Link, useNavigate } from 'react-router-dom';
import { CircleX, Plus, Check, X, Tags } from 'lucide-react';

export const BrandList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetching data through RTK
  const {
    data: responseGetBrands,
    isSuccess,
    isError,
    error,
  } = useGetAllBrandsQuery({
    page: currentPage,
    limit: 6,
  });

  const [
    toggleBrandList,
    { isError: isBrandListError, error: brandListError },
  ] = useToggleBrandListMutation();

  const tableHeaders = ['name', 'description', 'isActive'];

  const actions = [
    ({ id: brandId }) => (
      <EditButton onClick={() => navigate(`/admin/brands/edit/${brandId}`)} />
    ),
    ({ id: brandId, isActive }) => (
      <ToggleList
        onClick={() => handleListingModal(brandId)}
        title={
          isActive ? <X className='h-6 w-6' /> : <Check className='h-6 w-6' />
        }
      />
    ),
  ];

  const handleListingModal = (brandId) => {
    setSelectedBrand(brandId);
    setIsModalOpen(true);
  };

  const handleConfirmListing = async () => {
    try {
      const responseBrandList = await toggleBrandList(selectedBrand).unwrap();

      if (responseBrandList.success) {
        showToast.success(responseBrandList.message);
        navigate('/admin/brands');
      }
    } catch (error) {
      handleApiError(error, 'There was some error loading brands');
    }
  };

  const handleCancelListing = () => {
    setSelectedBrand(null);
    setIsModalOpen(false);
  };

  const tableData = isSuccess
    ? mapTableData(responseGetBrands?.data?.brands, tableHeaders)
    : [];
  if (isError) {
    console.log(error);
  }

  return (
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='mb-6 text-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-primary-text mb-4'>
          Brands
        </h1>
      </div>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0'>
        {/* Add Brand Button */}
        <Link to='/admin/brands/add'>
          <Button className='w-full sm:w-auto bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2'>
            <Plus className='mr-2 h-4 w-4' /> Add Brand
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
            icon={Tags}
            title='No Brands Found'
            description='No brands found. Please add a brand to list it here.'
          />
        )}
      </div>

      {/* Pagination */}
      <div className='sticky bottom-0'>
        {responseGetBrands?.data?.totalPages > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={responseGetBrands?.data?.totalPages || 0}
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

      {isBrandListError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={
            brandListError?.data?.message ||
            'Something went wrong! Please try again.'
          }
        />
      )}
    </div>
  );
};
