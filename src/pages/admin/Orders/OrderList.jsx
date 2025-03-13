import { useState } from 'react';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';
import { AdminPagination } from '@/components/admin';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from '@/redux/api/admin/ordersApi';
import { toast } from 'sonner';
import {
  DollarSign,
  Package,
  Search,
  User,
  CircleX,
  ShoppingBag,
  MapPin,
} from 'lucide-react';
import { Alert, EmptyState } from '@/components/common';
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
          order._id.includes(searchTerm) ||
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleChangeOrderStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
  };

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
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='mb-6 text-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-primary-text mb-4'>
          Orders
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
            placeholder='Search Orders...'
            className='pl-10 pr-4 py-2 rounded-full bg-secondary-bg text-primary-text border-accent-blue focus:border-accent-blue focus:ring focus:ring-accent-blue focus:ring-opacity-50 w-full'
          />
        </div>
      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto flex-grow no-scrollbar'>
        {filteredOrders?.length ? (
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
                    ₹{order.finalPrice.toFixed(2)}
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
                    <div className='transition-transform duration-200 hover:scale-105 active:scale-95'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleChangeOrderStatus(order)}
                            className='bg-accent-blue border-none text-primary-text hover:bg-accent-blue/90 transition'>
                            View Details
                          </Button>
                        </DialogTrigger>
                        {selectedOrder && (
                          <DialogContent className='sm:max-w-[800px] p-0 bg-secondary-bg border-none text-primary-text overflow-hidden'>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}>
                              <div className='bg-accent-blue text-white p-6 rounded-t-lg'>
                                <DialogHeader className='flex flex-row items-center justify-between'>
                                  <div>
                                    <DialogTitle className='text-2xl font-bold'>
                                      Order Details
                                    </DialogTitle>
                                    <p className='text-white/80 mt-1'>
                                      {new Date(
                                        order.placedAt
                                      ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      })}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={
                                      order.orderStatus === 'Delivered'
                                        ? 'success'
                                        : order.orderStatus === 'Cancelled'
                                        ? 'destructive'
                                        : 'default'
                                    }
                                    className='px-3 py-1.5 text-sm'>
                                    {order.orderStatus}
                                  </Badge>
                                </DialogHeader>
                              </div>

                              <div className='p-6'>
                                {/* Order Summary Section */}
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                                  <div className='flex items-start space-x-3'>
                                    <Package className='w-5 h-5 text-accent-blue mt-1 flex-shrink-0' />
                                    <div>
                                      <p className='text-sm text-secondary-text'>
                                        Order ID
                                      </p>
                                      <p className='font-medium text-sm break-all'>
                                        {order._id}
                                      </p>
                                    </div>
                                  </div>

                                  <div className='flex items-start space-x-3'>
                                    <User className='w-5 h-5 text-accent-blue mt-1 flex-shrink-0' />
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
                                    <DollarSign className='w-5 h-5 text-accent-blue mt-1 flex-shrink-0' />
                                    <div>
                                      <p className='text-sm text-secondary-text'>
                                        Payment Method
                                      </p>
                                      <div className='flex items-center gap-2'>
                                        <p className='font-medium'>
                                          {order.paymentMethod}
                                        </p>
                                        <Badge
                                          variant={
                                            order.paymentStatus === 'Paid'
                                              ? 'success'
                                              : order.paymentStatus === 'Failed'
                                              ? 'destructive'
                                              : 'default'
                                          }
                                          className='text-xs'>
                                          {order.paymentStatus}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Shipping Address */}
                                {order.shippingAddress && (
                                  <div className='bg-primary-bg/30 rounded-lg p-4 mb-6'>
                                    <h3 className='font-medium mb-2 flex items-center gap-2'>
                                      <MapPin className='h-4 w-4 text-accent-blue' />
                                      Shipping Address
                                    </h3>
                                    <div className='text-sm text-secondary-text'>
                                      <p>{order.shippingAddress.addressName}</p>
                                      <p>
                                        {order.shippingAddress.addressLine},{' '}
                                        {order.shippingAddress.city}
                                      </p>
                                      <p>
                                        {order.shippingAddress.state},{' '}
                                        {order.shippingAddress.zip}
                                      </p>
                                      <p>
                                        Phone: {order.shippingAddress.phone}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Order Items */}
                                <div className='mb-6'>
                                  <h3 className='font-medium mb-3'>
                                    Order Items
                                  </h3>
                                  <div className='bg-primary-bg/30 rounded-lg overflow-hidden'>
                                    <Table>
                                      <TableHeader>
                                        <TableRow className='bg-primary-bg/50'>
                                          <TableHead className='w-[50px]'></TableHead>
                                          <TableHead>Product</TableHead>
                                          <TableHead className='text-center'>
                                            Quantity
                                          </TableHead>
                                          <TableHead className='text-center'>
                                            Price
                                          </TableHead>
                                          <TableHead className='text-center'>
                                            Status
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {order.orderItems.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell className='p-2'>
                                              <div className='h-12 w-12 rounded bg-primary-bg/50 overflow-hidden'>
                                                <img
                                                  src={
                                                    item.product?.images?.[0] ||
                                                    '/placeholder.svg'
                                                  }
                                                  alt={item.product?.name}
                                                  className='h-full w-full object-cover'
                                                />
                                              </div>
                                              {console.log(item)}
                                            </TableCell>
                                            <TableCell className='font-medium'>
                                              {item.product?.name}
                                            </TableCell>
                                            <TableCell className='text-center'>
                                              {item.quantity}
                                            </TableCell>
                                            <TableCell className='text-center'>
                                              <div className='flex flex-col items-center'>
                                                <span>
                                                  ₹{item.price.toFixed(2)}
                                                </span>
                                                {item.discount > 0 && (
                                                  <span className='text-xs text-accent-red'>
                                                    -₹{item.discount.toFixed(2)}
                                                  </span>
                                                )}
                                              </div>
                                            </TableCell>
                                            <TableCell className='text-center'>
                                              <Badge
                                                variant={
                                                  item.status === 'Delivered'
                                                    ? 'success'
                                                    : item.status ===
                                                        'Cancelled' ||
                                                      item.status === 'Returned'
                                                    ? 'destructive'
                                                    : 'default'
                                                }>
                                                {item.status}
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>

                                {/* Order Summary */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                                  <div>
                                    <h3 className='font-medium mb-3'>
                                      Delivery Information
                                    </h3>
                                    <div className='bg-primary-bg/30 rounded-lg p-4 space-y-2'>
                                      <div className='flex justify-between text-sm'>
                                        <span className='text-secondary-text'>
                                          Order Date:
                                        </span>
                                        <span>
                                          {new Date(
                                            order.placedAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>

                                      {order.deliveryBy && (
                                        <div className='flex justify-between text-sm'>
                                          <span className='text-secondary-text'>
                                            Expected Delivery:
                                          </span>
                                          <span>
                                            {new Date(
                                              order.deliveryBy
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                      )}

                                      {order.orderStatus === 'Delivered' && (
                                        <div className='flex justify-between text-sm'>
                                          <span className='text-secondary-text'>
                                            Delivered On:
                                          </span>
                                          <span>
                                            {new Date(
                                              order.updatedAt
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className='font-medium mb-3'>
                                      Payment Summary
                                    </h3>
                                    <div className='bg-primary-bg/30 rounded-lg p-4 space-y-2'>
                                      <div className='flex justify-between text-sm'>
                                        <span className='text-secondary-text'>
                                          Subtotal:
                                        </span>
                                        <span>
                                          ₹{order.totalAmount.toFixed(2)}
                                        </span>
                                      </div>

                                      {order.totalDiscount > 0 && (
                                        <div className='flex justify-between text-sm'>
                                          <span className='text-secondary-text'>
                                            Item Discount:
                                          </span>
                                          <span className='text-accent-red'>
                                            -₹{order.totalDiscount.toFixed(2)}
                                          </span>
                                        </div>
                                      )}

                                      {order.couponCode && (
                                        <div className='flex justify-between text-sm'>
                                          <span className='text-secondary-text'>
                                            Coupon ({order.couponCode}):
                                          </span>
                                          <span className='text-accent-red'>
                                            -₹{order.couponDiscount.toFixed(2)}
                                          </span>
                                        </div>
                                      )}

                                      <div className='flex justify-between font-medium pt-2 border-t border-primary-bg/50'>
                                        <span>Total:</span>
                                        <span>
                                          ₹{order.finalPrice.toFixed(2)}
                                        </span>
                                      </div>

                                      {order.refundedAmount > 0 && (
                                        <div className='flex justify-between text-sm text-accent-green'>
                                          <span>Refunded:</span>
                                          <span>
                                            ₹{order.refundedAmount.toFixed(2)}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Status Update Section */}
                                <div className='border-t border-primary-bg/30 pt-6 mt-6'>
                                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
                                    <div className='md:col-span-2 space-y-2'>
                                      <label
                                        htmlFor='status'
                                        className='block text-sm font-medium text-secondary-text'>
                                        Update Order Status
                                      </label>
                                      <Select
                                        onValueChange={(value) =>
                                          setNewStatus(value)
                                        }
                                        defaultValue={order.orderStatus}>
                                        <SelectTrigger className='bg-primary-bg border-accent-blue/30 focus:ring-accent-blue'>
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

                                    <Button
                                      className='bg-accent-blue hover:bg-accent-blue/90 text-white'
                                      onClick={handleUpdateStatus}
                                      disabled={isUpdating}>
                                      {isUpdating
                                        ? 'Updating...'
                                        : 'Update Status'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='w-full flex items-center justify-center'>
            <EmptyState
              icon={ShoppingBag}
              title='No orders available'
              description='There are no orders to display at the moment.'
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className='sticky bottom-0 mt-4'>
        {responseGetOrders?.data?.totalPage > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={responseGetOrders?.data?.totalPage || 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

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
