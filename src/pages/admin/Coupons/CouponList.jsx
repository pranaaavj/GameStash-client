import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import { useState } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { AdminPagination } from '@/components/admin';
import { Plus, X, Check, Ticket } from 'lucide-react';
import { ConfirmationModal, EmptyState } from '@/components/common';
import { ContainerLoading } from '@/components/error';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/shadcn/components/ui/badge';
import { format } from 'date-fns';

import {
  useGetAllCouponsQuery,
  useToggleCouponListMutation,
} from '@/redux/api/admin/couponsApi';
import { handleApiError, showToast } from '@/utils';

export const CouponList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const { data: responseGetCoupons, isLoading } = useGetAllCouponsQuery({
    page: currentPage,
    limit: 10,
  });

  const [toggleCouponList, { isLoading: isToggleLoading }] =
    useToggleCouponListMutation();

  const tableHeaders = [
    'Code',
    'Discount Type',
    'Discount Value',
    'Min Order',
    'Max Discount',
    'Start Date',
    'End Date',
    'Status',
    'Action',
  ];

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
        showToast.success(responseToggleCoupon.message);
      }
    } catch (error) {
      handleApiError(error, 'There was some error listing coupon');
    } finally {
      setIsModalOpen(false);
      setSelectedCoupon(null);
    }
  };

  const handleCancelListing = () => {
    setSelectedCoupon(null);
    setIsModalOpen(false);
  };

  return (
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
        <div className='flex items-center gap-2'>
          <Ticket className='h-5 w-5 text-accent-blue' />
          <h1 className='text-2xl font-medium text-primary-text'>Coupons</h1>
        </div>

        <Link to='/admin/coupons/add'>
          <Button className='bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2'>
            <Plus className='mr-2 h-4 w-4' /> Add Coupon
          </Button>
        </Link>
      </div>

      <div className='w-full overflow-x-auto flex-grow no-scrollbar'>
        {isLoading ? (
          <ContainerLoading />
        ) : responseGetCoupons?.data?.coupons?.length ? (
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
              {responseGetCoupons?.data?.coupons?.map((coupon) => (
                <TableRow
                  key={coupon._id}
                  className='transition-colors duration-200 even:bg-primary-bg/5 hover:bg-primary-bg/20'>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {coupon.code}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {coupon.discountType === 'percentage'
                      ? 'Percentage'
                      : 'Fixed Amount'}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    ₹{coupon.minOrderAmount}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {coupon.maxDiscountAmount
                      ? `₹${coupon.maxDiscountAmount}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {format(new Date(coupon.startDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {format(new Date(coupon.endDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm border-b border-accent-blue/20'>
                    <Badge
                      className={`w-[110px] h-10 text-xs truncate text-center justify-center items-center flex ${
                        coupon.isActive
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-red-500/20 text-red-600'
                      }`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm border-b border-accent-blue/20'>
                    <div className='flex gap-2 justify-center'>
                      <Button
                        variant='ghost'
                        size='sm'
                        disabled={
                          new Date(coupon.endDate).getTime() < Date.now()
                        }
                        onClick={() =>
                          navigate(`/admin/coupons/edit/${coupon._id}`)
                        }
                        className='text-blue-600 hover:bg-hover-blue'>
                        Edit
                      </Button>

                      <Button
                        variant='ghost'
                        size='sm'
                        disabled={
                          new Date(coupon.endDate).getTime() < Date.now() ||
                          isToggleLoading
                        }
                        className={`min-w-[40px] justify-center ${
                          coupon.isActive
                            ? 'text-red-600 hover:bg-hover-red'
                            : 'text-green-600 hover:bg-hover-green'
                        }`}
                        onClick={() => handleListingModal(coupon._id)}>
                        {coupon.isActive ? (
                          <>
                            <X className='h-4 w-4' /> Unlist
                          </>
                        ) : (
                          <>
                            <Check className='h-4 w-4' /> List
                          </>
                        )}
                      </Button>
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

      <div className='sticky bottom-0 mt-4'>
        {responseGetCoupons?.data?.totalPages > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={responseGetCoupons?.data?.totalPages || 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelListing}
        onConfirm={handleConfirmListing}
        title='Confirm Action'
        description='Are you sure you want to proceed with this action?'
      />
    </div>
  );
};
