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
import { toast } from 'sonner';
import { Alert } from '@/components/common';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';
import { mapTableData } from '@/utils';
import { ConfirmationModal } from '@/components/common';
import { Link, useNavigate } from 'react-router-dom';
import { CircleX, Plus, Search, Check, X } from 'lucide-react';

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
      const responseBrandList = await toggleBrandList(selectedBrand);

      if (responseBrandList.success) {
        toast.success(responseBrandList.message, {
          duration: 1500,
        });
        setTimeout(() => navigate('/admin/brands'), 1500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelListing = () => {
    setSelectedBrand(null);
    setIsModalOpen(false);
  };

  const tableData = isSuccess
    ? mapTableData(responseGetBrands?.data?.brands, tableHeaders)
    : [];
  console.log(tableData);
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
        {/* Search Input */}
        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-text h-4 w-4' />
          <Input
            type='text'
            placeholder='Search...'
            className='pl-10 pr-4 py-2 rounded-full bg-secondary-bg text-primary-text border-accent-blue focus:border-accent-blue focus:ring focus:ring-accent-blue focus:ring-opacity-50 w-full'
          />
        </div>

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
          'No Data to show'
        )}
      </div>

      {/* Pagination */}
      <div className='sticky bottom-0'>
        <AdminPagination
          currentPage={currentPage}
          totalPages={responseGetBrands?.data?.totalPages || 0}
          onPageChange={(page) => setCurrentPage(page)}
        />
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
