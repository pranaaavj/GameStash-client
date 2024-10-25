import {
  EditButton,
  DeleteButton,
  ReuseableTable,
} from '../../../components/admin';
import { Link } from 'react-router-dom';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';
import { Pagination } from '@/components/common';
import { mapTableData } from '@/utils';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useGetAllProductsQuery } from '@/redux/api/adminApi';

export const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: response,
    isSuccess,
    isError,
    error,
  } = useGetAllProductsQuery(
    {
      page: currentPage,
      limit: 5,
    },
    { refetchOnMountOrArgChange: true, keepUnusedDataFor: 0 }
  );

  const tableHeaders = ['name', 'price', 'platform', 'genre', 'stock'];

  const actions = [() => <EditButton />, () => <DeleteButton />];

  const tableData = isSuccess
    ? mapTableData(response?.data?.products, tableHeaders)
    : [];

  if (isError) {
    console.log(error);
  }

  return (
    <div className='w-full h-full overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='mb-6 text-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-primary-text mb-4'>
          Products
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

        {/* Add Product Button */}
        <Link to='/admin/products/add'>
          <Button className='w-full sm:w-auto bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2'>
            <Plus className='mr-2 h-4 w-4' /> Add Product
          </Button>
        </Link>
      </div>
      {/* Table */}
      <div className='w-full overflow-x-auto'>
        {
          <ReuseableTable
            headers={tableHeaders}
            data={tableData}
            actions={actions}
          />
        }
      </div>
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={response?.data?.totalPages || 0}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};
