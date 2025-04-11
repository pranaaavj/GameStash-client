import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import { useState } from 'react';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';
import { AdminPagination } from '@/components/admin';
import { Search, Edit, Plus, CircleX, X, Check, Ticket } from 'lucide-react';
import { Alert, ConfirmationModal, EmptyState } from '@/components/common';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/shadcn/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  useGetAllCouponsQuery,
  useToggleCouponListMutation,
} from '@/redux/api/admin/couponsApi';

export const CouponList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const {
    data: responseGetCoupons,
    isError,
    error,
  } = useGetAllCouponsQuery({ page: currentPage, limit: 10 });

  const [toggleCouponList] = useToggleCouponListMutation();

  const tableHeaders = [
    'Code',
    'Discount Type',
    'Discount Value',
    'Min Order',
    'Max Discount',
    'Start Date',
    'End Date',
    'Status',
    'Actions',
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredCoupons = responseGetCoupons?.data?.coupons?.filter(
    (coupon) =>
      coupon._id.includes(searchTerm) ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleListingModal = (couponId) => {
    setSelectedCoupon(couponId);
    setIsModalOpen(true);
  };

  const handleConfirmListing = async () => {
    try {
      const responseToggleCoupon = await toggleCouponList(
        selectedCoupon
      ).unwrap();

      if (responseToggleCoupon.success) {
        toast.success(responseToggleCoupon.message, {
          duration: 1500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelListing = () => {
    setSelectedCoupon(null);
    setIsModalOpen(false);
  };

  return (
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='mb-6 text-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-primary-text mb-4'>
          Coupons
        </h1>
      </div>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0'>
        {/* Search Input */}
        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-text h-4 w-4' />
          <Input
            type='text'
            value={searchTerm}
            onChange={handleSearch}
            placeholder='Search Coupons...'
            className='pl-10 pr-4 py-2 rounded-full bg-secondary-bg text-primary-text border-accent-blue focus:border-accent-blue focus:ring focus:ring-accent-blue focus:ring-opacity-50 w-full'
          />
        </div>

        {/* Add Coupon Button */}
        <Link to='/admin/coupons/add'>
          <Button className='w-full sm:w-auto bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2'>
            <Plus className='mr-2 h-4 w-4' /> Add Coupon
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto flex-grow no-scrollbar'>
        {filteredCoupons?.length ? (
          <Table className='w-full table-fixed border-collapse min-w-full'>
            <TableHeader>
              <TableRow className='bg-secondary-bg/10 border-b-2 border-accent-blue'>
                {tableHeaders.map((header, index) => (
                  <TableHead
                    key={index}
                    className='px-2 md:px-4 py-3 text-xs md:text-sm text-center font-semibold text-primary-text uppercase tracking-wider'>
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.map((coupon) => (
                <TableRow
                  key={coupon._id}
                  className='transition-colors duration-200 even:bg-primary-bg/5 hover:bg-primary-bg/20'>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {coupon.code}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {coupon.discountType === 'percentage'
                      ? 'Percentage'
                      : 'Fixed Amount'}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    ₹{coupon.minOrderAmount}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {coupon.maxDiscountAmount
                      ? `₹${coupon.maxDiscountAmount}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {format(new Date(coupon.startDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {format(new Date(coupon.endDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    <Badge
                      variant={coupon.isActive ? 'success' : 'destructive'}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>

                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20'>
                    <div className='flex gap-2'>
                      <div className='transition-transform duration-200 hover:scale-105 active:scale-95'>
                        <Button
                          variant='outline'
                          size='sm'
                          disabled={
                            new Date(coupon.endDate).getTime() <
                            new Date().getTime()
                          }
                          onClick={() =>
                            navigate(`/admin/coupons/edit/${coupon._id}`)
                          }
                          className='bg-accent-blue border-none px-3 py-5 text-primary-text hover:bg-accent-blue/90 transition'>
                          <Edit className='h-6 w-6' />
                        </Button>
                      </div>
                      <div className='transition-transform duration-200 hover:scale-105 active:scale-95'>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => handleListingModal(coupon._id)}
                          disabled={
                            new Date(coupon.endDate).getTime() <
                            new Date().getTime()
                          }
                          className='bg-accent-red border-none h-8 w-8 px-5 py-5 text-primary-text hover:bg-accent-red/90 transition'>
                          {coupon.isActive ? (
                            <X className='h-4 w-4' />
                          ) : (
                            <Check className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='w-full flex items-center justify-center'>
            <EmptyState
              icon={Ticket}
              title='No coupons available'
              description='There are no coupons to display at the moment. Create a new coupon to get started.'
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className='sticky bottom-0 mt-4'>
        {responseGetCoupons?.data?.totalPages > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={responseGetCoupons?.data?.totalPages || 0}
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

      {/* Error message */}
      {isError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={
            error?.data?.message || 'Something went wrong! Please try again.'
          }
        />
      )}
    </div>
  );
};
