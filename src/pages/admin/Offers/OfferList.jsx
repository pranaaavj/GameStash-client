import { useState } from 'react';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';
import { AdminPagination } from '@/components/admin';
import { Search, Edit, Plus, CircleX, X, Check } from 'lucide-react';
import { Alert, ConfirmationModal } from '@/components/common';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/shadcn/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import { toast } from 'sonner';
import {
  useGetAllOffersQuery,
  useToggleOfferListMutation,
} from '@/redux/api/admin/offersApi';

export const OfferList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Fetching offers
  const {
    data: responseGetOffers,
    isError,
    error,
  } = useGetAllOffersQuery({ page: currentPage, limit: 10 });

  // Toggle Offer Status Mutation
  const [toggleOfferList] = useToggleOfferListMutation();

  const tableHeaders = [
    'Offer ID',
    'Name',
    'Type',
    'Discount',
    'Expiration Date',
    'Status',
    'Actions',
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredOffers = responseGetOffers?.data?.offers?.filter(
    (offer) =>
      offer._id.includes(searchTerm) ||
      offer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleListingModal = (offerId) => {
    setSelectedOffer(offerId);
    setIsModalOpen(true);
  };

  const handleConfirmListing = async () => {
    try {
      const responseToggleOffer = await toggleOfferList(selectedOffer).unwrap();

      if (responseToggleOffer.success) {
        toast.success(responseToggleOffer.message, {
          duration: 1500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelListing = () => {
    setSelectedOffer(null);
    setIsModalOpen(false);
  };

  return (
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='mb-6 text-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-primary-text mb-4'>
          Offers
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
            placeholder='Search Offers...'
            className='pl-10 pr-4 py-2 rounded-full bg-secondary-bg text-primary-text border-accent-blue focus:border-accent-blue focus:ring focus:ring-accent-blue focus:ring-opacity-50 w-full'
          />
        </div>

        {/* Add Offer Button */}
        <Link to='/admin/offers/add'>
          <Button className='w-full sm:w-auto bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2'>
            <Plus className='mr-2 h-4 w-4' /> Add Offer
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto flex-grow no-scrollbar'>
        {filteredOffers?.length ? (
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
              {filteredOffers.map((offer) => (
                <TableRow
                  key={offer._id}
                  className='transition-colors duration-200 even:bg-primary-bg/5 hover:bg-primary-bg/20'>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {offer._id}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {offer.name}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {offer.type}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {offer.discountType === 'percentage'
                      ? `${offer.discountValue}%`
                      : `₹${offer.discountValue}`}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {new Date(offer.expirationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    <Badge variant={offer.isActive ? 'success' : 'destructive'}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>

                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20'>
                    <div className='flex gap-2'>
                      <div className='transition-transform duration-200 hover:scale-105 active:scale-95'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            navigate(`/admin/offers/edit/${offer._id}`)
                          }
                          className='bg-accent-blue border-none px-3 py-5 text-primary-text hover:bg-accent-blue/90 transition'>
                          <Edit className='h-6 w-6' />
                        </Button>
                      </div>
                      <div className='transition-transform duration-200 hover:scale-105 active:scale-95'>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => handleListingModal(offer._id)}
                          className='bg-accent-red border-none h-8 w-8 px-5 py-5 text-primary-text hover:bg-accent-red/90 transition'>
                          {offer.isActive ? (
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
          <p className='text-center text-primary-text py-4'>
            No offers to display
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className='sticky bottom-0 mt-4'>
        <AdminPagination
          currentPage={currentPage}
          totalPages={responseGetOffers?.data?.totalPages || 0}
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
