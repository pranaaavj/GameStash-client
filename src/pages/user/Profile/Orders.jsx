/* eslint-disable react/prop-types */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  X,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/ui/card';
import { Button } from '@/shadcn/components/ui/button';
import { Badge } from '@/shadcn/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import {
  useGetOrdersQuery,
  useCancelOrdersMutation,
} from '@/redux/api/user/ordersApi';
import { toast } from 'sonner';

const statusColors = {
  Pending: 'bg-yellow-500',
  Processing: 'bg-blue-500',
  Shipped: 'bg-purple-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'Pending':
      return <AlertCircle className='w-5 h-5 text-yellow-500' />;
    case 'Processing':
      return <Package className='w-5 h-5 text-blue-500' />;
    case 'Shipped':
      return <Truck className='w-5 h-5 text-purple-500' />;
    case 'Delivered':
      return <CheckCircle className='w-5 h-5 text-green-500' />;
    default:
      return <AlertCircle className='w-5 h-5 text-red-500' />;
  }
};

export const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: responseOrders } = useGetOrdersQuery({});
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrdersMutation();

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder({ orderId }).unwrap();
      toast.success('Order cancelled successfully');
      setSelectedOrder(null);
    } catch (error) {
      console.log(error);
      toast.error('Failed to cancel order. Please try again.');
    }
  };

  return (
    <Card className='bg-secondary-bg border-none shadow-lg text-primary-text'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold'>Order History</CardTitle>
        <CardDescription>View and manage your recent orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-primary-text'>
          {responseOrders &&
            responseOrders?.data?.orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}>
                <Card className='bg-primary-bg/50 border-none hover:shadow-md transition-shadow duration-300 text-primary-text'>
                  <CardHeader>
                    <CardTitle className='text-lg font-semibold flex items-center justify-between'>
                      Order #{order._id.slice(-6)}
                      <StatusIcon status={order.orderStatus} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <span className='text-secondary-text'>Status</span>
                        <Badge
                          className={`${
                            statusColors[order.orderStatus]
                          } text-white`}>
                          {order.orderStatus}
                        </Badge>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-secondary-text'>Total</span>
                        <span className='font-semibold'>
                          ₹{order.finalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-secondary-text'>Items</span>
                        <span>{order.orderItems.length}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant='outline'
                      className='w-full bg-primary-bg/50 hover:bg-secondary-bg border-none'
                      onClick={() => setSelectedOrder(order)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
        </div>
      </CardContent>

      <AnimatePresence>
        {selectedOrder && (
          <Dialog
            open={!!selectedOrder}
            onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent
              hideClose
              className='sm:max-w-[600px] [&>button]:hidden bg-secondary-bg text-primary-text border-none'>
              <DialogHeader>
                <DialogTitle className='text-2xl font-bold flex items-center justify-between'>
                  Order Details
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setSelectedOrder(null)}
                    className='rounded-full h-8 w-8 p-0'>
                    <X className='h-4 w-4' />
                  </Button>
                </DialogTitle>
                <DialogDescription>
                  Order #{selectedOrder._id.slice(-6)} - Placed on{' '}
                  {new Date(selectedOrder.placedAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <div className='mt-4 space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='font-semibold'>Order Status</span>
                  <Badge
                    className={`${
                      statusColors[selectedOrder.orderStatus]
                    } text-white`}>
                    {selectedOrder.orderStatus}
                  </Badge>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='font-semibold'>Payment Method</span>
                  <div className='flex items-center'>
                    <CreditCard className='w-4 h-4 mr-2' />
                    {selectedOrder.paymentMethod}
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='font-semibold'>Payment Status</span>
                  <Badge
                    variant={
                      selectedOrder.paymentStatus === 'Paid'
                        ? 'success'
                        : 'destructive'
                    }>
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className='text-right'>Quantity</TableHead>
                      <TableHead className='text-right'>Price</TableHead>
                      <TableHead className='text-right'>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.orderItems.map((item) => (
                      <TableRow key={item?.product?._id}>
                        <TableCell className='font-medium'>
                          {item?.product?.name}
                        </TableCell>
                        <TableCell className='text-right'>
                          {item?.quantity}
                        </TableCell>
                        <TableCell className='text-right'>
                          ₹{item?.price?.toFixed(2)}
                        </TableCell>
                        <TableCell className='text-right'>
                          ₹{item?.totalPrice?.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className='flex justify-between items-center text-lg font-semibold'>
                  <span>Total Amount</span>
                  <span>₹{selectedOrder?.finalPrice.toFixed(2)}</span>
                </div>
                {selectedOrder?.orderStatus !== 'Cancelled' &&
                  selectedOrder?.orderStatus !== 'Delivered' && (
                    <Button
                      variant='destructive'
                      className='w-full'
                      onClick={() => handleCancelOrder(selectedOrder?._id)}
                      disabled={isCancelling}>
                      {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                    </Button>
                  )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Card>
  );
};
