import { useState } from 'react';
import { Input } from '@/shadcn/components/ui/input';
import { AdminPagination } from '@/components/admin';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from '@/redux/api/admin/ordersApi';
import { toast } from 'sonner';
import { Clock, DollarSign, Package, Search, User } from 'lucide-react';
import { Alert } from '@/components/common';
import { motion } from 'framer-motion';
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
import { Button } from '@/shadcn/components/ui/button';
import { Badge } from '@/shadcn/components/ui/badge';

export const OrderList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const {
    data: responseGetOrders,
    isSuccess,
    isError,
    error,
  } = useGetAllOrdersQuery({
    page: currentPage,
    limit: 10,
  });

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const tableHeaders = [
    'Order ID',
    'User',
    'Items',
    'Total Amount',
    'Payment Status',
    'Order Status',
    'Placed At',
    'Actions',
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredOrders = isSuccess
    ? responseGetOrders?.data?.orders.filter(
        (order) =>
          order._id.includes(searchTerm) || // Search by Order ID
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleChangeOrderStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
  };
  console.log(newStatus);

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await updateOrderStatus({
        orderId: selectedOrder._id,
        status: newStatus,
      }).unwrap();

      toast.success('Order status updated successfully', { duration: 1500 });
      setSelectedOrder(null);
      setNewStatus('');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(
        error?.data?.message || 'Failed to change the status of the order'
      );
    }
  };

  if (isError) {
    console.error(error);
  }

  return (
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-6'>
      <div className='mb-6 text-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-primary-text mb-4'>
          Orders
        </h1>
      </div>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0'>
        {/* Search Input */}
        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-text h-4 w-4' />
          <Input
            type='text'
            value={searchTerm}
            onChange={handleSearch}
            placeholder='Search Orders...'
            className='pl-10 pr-4 py-2 rounded-full bg-secondary-bg text-primary-text border-accent-blue focus:border-accent-blue focus:ring focus:ring-accent-blue focus:ring-opacity-50 w-full'
          />
        </div>
      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto no-scrollbar'>
        {filteredOrders.length ? (
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
              {filteredOrders.map((order) => (
                <TableRow
                  key={order._id}
                  className='transition-colors duration-200 even:bg-primary-bg/5 hover:bg-primary-bg/20'>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {order._id}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {order.user?.name || 'N/A'}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {order.orderItems
                      .map((item) => item.product?.name)
                      .join(', ')}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    ${order.finalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    <Badge
                      variant={
                        order.paymentStatus === 'Paid'
                          ? 'success'
                          : 'destructive'
                      }>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    <Badge
                      variant={
                        order.orderStatus === 'Delivered'
                          ? 'success'
                          : 'default'
                      }>
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {new Date(order.placedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleChangeOrderStatus(order)}
                          className='bg-accent-blue border-none text-primary-text hover:bg-accent-blue/90 transition'>
                          Change Status
                        </Button>
                      </DialogTrigger>
                      {selectedOrder && (
                        <DialogContent className='sm:max-w-[500px] p-0 bg-secondary-bg border-none text-primary-text overflow-hidden'>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}>
                            <div className='bg-accent-blue text-white p-6 rounded-t-lg'>
                              <DialogHeader>
                                <DialogTitle className='text-2xl font-bold'>
                                  Change Order Status
                                </DialogTitle>
                              </DialogHeader>
                            </div>
                            <div className='p-6 space-y-6'>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='flex items-start space-x-3'>
                                  <Package className='w-6 h-6 text-accent-blue mt-1' />
                                  <div>
                                    <p className='text-sm text-secondary-text'>
                                      Order ID
                                    </p>
                                    <p className='font-medium break-all'>
                                      {order._id}
                                    </p>
                                  </div>
                                </div>
                                <div className='flex items-start space-x-3'>
                                  <User className='w-6 h-6 text-accent-blue mt-1' />
                                  <div>
                                    <p className='text-sm text-secondary-text'>
                                      Customer
                                    </p>
                                    <p className='font-medium'>
                                      {order.user?.name || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                <div className='flex items-start space-x-3'>
                                  <DollarSign className='w-6 h-6 text-accent-blue mt-1' />
                                  <div>
                                    <p className='text-sm text-secondary-text'>
                                      Total Amount
                                    </p>
                                    <p className='font-medium'>
                                      ${order.finalPrice.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                                <div className='flex items-start space-x-3'>
                                  <Clock className='w-6 h-6 text-accent-blue mt-1' />
                                  <div>
                                    <p className='text-sm text-secondary-text'>
                                      Current Status
                                    </p>
                                    <Badge
                                      variant={
                                        order.orderStatus === 'Delivered'
                                          ? 'success'
                                          : 'default'
                                      }>
                                      {order.orderStatus}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className='space-y-2 pt-4'>
                                <label
                                  htmlFor='status'
                                  className='block text-sm font-medium text-secondary-text'>
                                  New Status
                                </label>
                                <Select
                                  onValueChange={(value) => setNewStatus(value)}
                                  defaultValue={order.orderStatus}>
                                  <SelectTrigger className='w-full bg-primary-bg border-accent-blue/30 focus:ring-accent-blue'>
                                    <SelectValue placeholder='Select status' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='Processing'>
                                      Processing
                                    </SelectItem>
                                    <SelectItem value='Shipped'>
                                      Shipped
                                    </SelectItem>
                                    <SelectItem value='Delivered'>
                                      Delivered
                                    </SelectItem>
                                    <SelectItem value='Cancelled'>
                                      Cancelled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className='pt-4'>
                                <Button
                                  className='w-full bg-accent-blue hover:bg-accent-blue/90 text-white'
                                  onClick={handleUpdateStatus}
                                  disabled={isUpdating}>
                                  {isUpdating ? 'Updating...' : 'Update Status'}
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className='text-sm text-center'>No orders to display</p>
        )}
      </div>

      {/* Pagination */}
      <div className='sticky bottom-0 mt-4'>
        <AdminPagination
          currentPage={currentPage}
          totalPages={responseGetOrders?.data?.totalPage || 0}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Error message */}
      {isError && (
        <Alert
          Icon={Search}
          variant='destructive'
          description={
            error?.data?.message || 'Something went wrong! Please try again.'
          }
        />
      )}
    </div>
  );
};
