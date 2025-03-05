import { useState } from 'react';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';
import { AdminPagination } from '@/components/admin';
import { Search, Edit, Trash2, Plus, CircleX } from 'lucide-react';
import { Alert, ConfirmationModal } from '@/components/common';
import { Link } from 'react-router-dom';
import { Badge } from '@/shadcn/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const OfferList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

  // Mock data for offers - replace with actual API call
  const {
    data: responseGetOffers,
    isError,
    error,
    refetch,
  } = {
    data: {
      data: {
        offers: [
          {
            id: '1',
            name: 'Summer Sale',
            type: 'category',
            discountType: 'percentage',
            discountValue: 20,
            expirationDate: '2023-08-31',
            status: 'Active',
            usageCount: 150,
          },
          {
            id: '2',
            name: 'New User Discount',
            type: 'product',
            discountType: 'fixed',
            discountValue: 500,
            expirationDate: '2023-12-31',
            status: 'Active',
            usageCount: 50,
          },
          {
            id: '3',
            name: 'Holiday Special',
            type: 'category',
            discountType: 'percentage',
            discountValue: 15,
            expirationDate: '2023-12-25',
            status: 'Scheduled',
            usageCount: 0,
          },
        ],
        totalPages: 1,
      },
    },
    isSuccess: true,
    isError: false,
    error: null,
    refetch: () => console.log('Refetching offers'),
  };

  // Mock mutation for toggling offer status
  const [toggleOfferStatus, { isError: isToggleError, error: toggleError }] = [
    async (id) => {
      console.log('Toggling offer status:', id);
      return { success: true, message: 'Offer status updated successfully' };
    },
    { isError: false, error: null },
  ];

  // Mock mutation for deleting offer
  const [deleteOffer, { isError: isDeleteError, error: deleteError }] = [
    async (id) => {
      console.log('Deleting offer:', id);
      return { success: true, message: 'Offer deleted successfully' };
    },
    { isError: false, error: null },
  ];

  const tableHeaders = [
    'Offer ID',
    'Name',
    'Type',
    'Discount',
    'Expiration Date',
    'Status',
    'Usage Count',
    'Actions',
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredOffers = responseGetOffers?.data?.offers.filter(
    (offer) =>
      offer.id.includes(searchTerm) ||
      offer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangeOfferStatus = (offer) => {
    setSelectedOffer(offer);
    setNewStatus(offer.status);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOffer || !newStatus) return;

    try {
      const response = await toggleOfferStatus({
        offerId: selectedOffer.id,
        status: newStatus,
      });

      if (response.success) {
        toast.success(response.message, {
          duration: 1500,
        });
        setSelectedOffer(null);
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteModal = (offerId) => {
    setOfferToDelete(offerId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteOffer(offerToDelete);

      if (response.success) {
        toast.success(response.message, {
          duration: 1500,
        });
        setIsDeleteModalOpen(false);
        setOfferToDelete(null);
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelDelete = () => {
    setOfferToDelete(null);
    setIsDeleteModalOpen(false);
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
        {filteredOffers && filteredOffers.length ? (
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
                  key={offer.id}
                  className='transition-colors duration-200 even:bg-primary-bg/5 hover:bg-primary-bg/20'>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {offer.id}
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
                    <Badge
                      variant={
                        offer.status === 'Active'
                          ? 'success'
                          : offer.status === 'Scheduled'
                          ? 'warning'
                          : 'destructive'
                      }>
                      {offer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {offer.usageCount}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20'>
                    <div className='flex justify-center space-x-2'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleChangeOfferStatus(offer)}
                            className='bg-accent-blue border-none px-3 py-5 text-primary-text hover:bg-accent-blue/90 transition'>
                            <Edit className='h-6 w-6' />
                          </Button>
                        </DialogTrigger>
                        {selectedOffer && (
                          <DialogContent className='sm:max-w-[500px] p-0 bg-secondary-bg border-none text-primary-text overflow-hidden'>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}>
                              <div className='bg-accent-blue text-white p-6 rounded-t-lg'>
                                <DialogHeader>
                                  <DialogTitle className='text-2xl font-bold'>
                                    Edit Offer
                                  </DialogTitle>
                                </DialogHeader>
                              </div>
                              <div className='p-6 space-y-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                  <div>
                                    <p className='text-sm text-secondary-text'>
                                      Offer ID
                                    </p>
                                    <p className='font-medium break-all'>
                                      {selectedOffer.id}
                                    </p>
                                  </div>
                                  <div>
                                    <p className='text-sm text-secondary-text'>
                                      Name
                                    </p>
                                    <p className='font-medium'>
                                      {selectedOffer.name}
                                    </p>
                                  </div>
                                  <div>
                                    <p className='text-sm text-secondary-text'>
                                      Type
                                    </p>
                                    <p className='font-medium'>
                                      {selectedOffer.type}
                                    </p>
                                  </div>
                                  <div>
                                    <p className='text-sm text-secondary-text'>
                                      Discount
                                    </p>
                                    <p className='font-medium'>
                                      {selectedOffer.discountType ===
                                      'percentage'
                                        ? `${selectedOffer.discountValue}%`
                                        : `₹${selectedOffer.discountValue}`}
                                    </p>
                                  </div>
                                </div>
                                <div className='space-y-2 pt-4'>
                                  <label
                                    htmlFor='status'
                                    className='block text-sm font-medium text-secondary-text'>
                                    Status
                                  </label>
                                  <Select
                                    onValueChange={(value) =>
                                      setNewStatus(value)
                                    }
                                    defaultValue={selectedOffer.status}>
                                    <SelectTrigger className='w-full bg-primary-bg border-accent-blue/30 focus:ring-accent-blue'>
                                      <SelectValue placeholder='Select status' />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value='Active'>
                                        Active
                                      </SelectItem>
                                      <SelectItem value='Inactive'>
                                        Inactive
                                      </SelectItem>
                                      <SelectItem value='Scheduled'>
                                        Scheduled
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className='pt-4'>
                                  <Button
                                    className='w-full bg-accent-blue hover:bg-accent-blue/90 text-white'
                                    onClick={handleUpdateStatus}>
                                    Update Offer
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          </DialogContent>
                        )}
                      </Dialog>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteModal(offer.id)}
                        className='bg-red-500 border-none px-3 py-5 text-white hover:bg-red-600 transition'>
                        <Trash2 className='h-6 w-6' />
                      </Button>
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
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title='Delete Offer'
        description='Are you sure you want to delete this offer? This action cannot be undone.'
      />

      {/* Error message */}
      {(isError || isToggleError || isDeleteError) && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={
            error?.data?.message ||
            toggleError?.data?.message ||
            deleteError?.data?.message ||
            'Something went wrong! Please try again.'
          }
        />
      )}
    </div>
  );
};
