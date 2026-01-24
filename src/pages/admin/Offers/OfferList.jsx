import { useState } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { AdminPagination } from '@/components/admin';
import { Plus, X, Check, Tag } from 'lucide-react';
import { ConfirmationModal, EmptyState } from '@/components/common';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/shadcn/components/ui/badge';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';

import {
  useGetAllOffersQuery,
  useToggleOfferListMutation,
} from '@/redux/api/admin/offersApi';
import { handleApiError, showToast } from '@/utils';
import { ContainerLoading } from '@/components/error';

export const OfferList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const { data: responseGetOffers, isLoading } = useGetAllOffersQuery({
    page: currentPage,
    limit: 10,
  });

  console.log(responseGetOffers);

  const [toggleOfferList, { isLoading: isToggleLoading }] =
    useToggleOfferListMutation();

  const tableHeaders = [
    'Offer Name',
    'Offer Type',
    'Target',
    'Discount',
    'Start Date',
    'End Date',
    'Status',
    'Action',
  ];

  const handleListingModal = (offerId) => {
    setSelectedOffer(offerId);
    setIsModalOpen(true);
  };

  const handleConfirmListing = async () => {
    try {
      const responseToggleOffer = await toggleOfferList(selectedOffer).unwrap();
      if (responseToggleOffer.success) {
        showToast.success(responseToggleOffer.message);
      }
    } catch (error) {
      handleApiError(error, 'There was an error showing offers');
    } finally {
      setIsModalOpen(false);
      setSelectedOffer(null);
    }
  };

  const handleCancelListing = () => {
    setSelectedOffer(null);
    setIsModalOpen(false);
  };

  if (isLoading || !responseGetOffers) {
    return <ContainerLoading />;
  }

  return (
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
        <div className='flex items-center gap-2'>
          <Tag className='h-5 w-5 text-accent-blue' />
          <h1 className='text-2xl font-medium text-primary-text'>Offers</h1>
        </div>

        <Link to='/admin/offers/add'>
          <Button className='bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2'>
            <Plus className='mr-2 h-4 w-4' /> Add Offer
          </Button>
        </Link>
      </div>

      <div className='w-full overflow-x-auto flex-grow no-scrollbar'>
        {responseGetOffers?.data?.offers?.length ? (
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
              {responseGetOffers?.data?.offers?.map((offer) => (
                <TableRow
                  key={offer._id}
                  className='transition-colors duration-200 even:bg-primary-bg/5 hover:bg-primary-bg/20'>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {offer.name}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {offer.type}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {offer.targetId?.name}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {offer.discountType === 'percentage'
                      ? `${offer.discountValue}%`
                      : `₹${offer.discountValue}`}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {format(new Date(offer.startDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {format(new Date(offer.endDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm border-b border-accent-blue/20'>
                    <Badge
                      className={`w-[110px] h-10 text-xs truncate text-center justify-center items-center flex ${
                        offer.isActive
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-red-500/20 text-red-600'
                      }`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center text-xs md:text-sm border-b border-accent-blue/20'>
                    <div className='flex gap-2 justify-center'>
                      <Button
                        variant='ghost'
                        size='sm'
                        disabled={
                          new Date(offer.endDate).getTime() < Date.now()
                        }
                        onClick={() =>
                          navigate(`/admin/offers/edit/${offer._id}`)
                        }
                        className='text-blue-600 hover:bg-hover-blue'>
                        Edit
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        disabled={
                          new Date(offer.endDate).getTime() < Date.now() ||
                          isToggleLoading
                        }
                        className={`min-w-[40px] justify-center ${
                          offer.isActive
                            ? 'text-red-600 hover:bg-hover-red'
                            : 'text-green-600 hover:bg-hover-green'
                        }`}
                        onClick={() => handleListingModal(offer._id)}>
                        {offer.isActive ? (
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
              icon={Tag}
              title='No offers available'
              description='There are no offers to display at the moment. Create a new offer to get started.'
            />
          </div>
        )}
      </div>

      <div className='sticky bottom-0 mt-4'>
        {responseGetOffers?.data?.totalPages > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={responseGetOffers?.data?.totalPages || 0}
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
