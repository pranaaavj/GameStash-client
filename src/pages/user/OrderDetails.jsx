import {
  useGetOrderQuery,
  useCancelOrderMutation,
  useRequestReturnOrderMutation,
} from '@/redux/api/user/ordersApi';
import { toast } from 'sonner';
import { useState } from 'react';
import { Alert, StatusBadge } from '@/components/common';
import { ConfirmationModal } from '@/components/common';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  ArrowLeft,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  ShoppingBag,
  AlertCircle,
  Truck,
  RotateCcw,
  CircleX,
} from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/ui/card';
import { Badge } from '@/shadcn/components/ui/badge';
import { Separator } from '@/shadcn/components/ui/separator';
import { Skeleton } from '@/shadcn/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shadcn/components/ui/tabs';

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('cancel-item'); // 'cancel-item', 'cancel-order', 'return-item'

  const {
    data: responseOrder,
    isLoading,
    isError,
  } = useGetOrderQuery({ orderId });

  const [
    cancelOrder,
    { isLoading: isCancelling, isError: isCancelError, error: cancelError },
  ] = useCancelOrderMutation();

  const [requestReturnOrder] = useRequestReturnOrderMutation();

  const handleCancelItem = async () => {
    setIsModalOpen(false);

    try {
      const response = await cancelOrder({
        orderId,
        productId: selectedProduct,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message, {
          duration: 1500,
        });
      }
    } catch (error) {
      toast.error('Failed to cancel item');
      console.log(error);
    } finally {
      setSelectedProduct(null);
    }
  };

  const handleCancelOrder = async () => {
    setIsModalOpen(false);

    try {
      const response = await cancelOrder({
        orderId,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message, {
          duration: 1500,
        });
      }
    } catch (error) {
      toast.error('Failed to cancel order');
      console.log(error);
    }
  };

  const handleReturnItem = async () => {
    setIsModalOpen(false);
    try {
      const response = await requestReturnOrder({
        orderId,
        productId: selectedProduct,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message, {
          duration: 1500,
        });
      }
    } catch (error) {
      toast.error('Failed to return order');
      console.log(error);
    }
    setSelectedProduct(null);
  };

  const handleConfirmAction = () => {
    if (modalType === 'cancel-item') {
      handleCancelItem();
    } else if (modalType === 'cancel-order') {
      handleCancelOrder();
    } else if (modalType === 'return-item') {
      handleReturnItem();
    }
  };

  if (isLoading) {
    return (
      <div className='p-6 md:p-8 text-primary-text'>
        <Button
          variant='ghost'
          onClick={() => navigate('/orders')}
          className='mb-8 flex items-center gap-2 hover:bg-[#252536] text-[#E2E4F3]'>
          <ArrowLeft className='h-4 w-4' /> Back to Orders
        </Button>

        <Card className='bg-[#1E1E2A] shadow-md rounded-xl'>
          <CardHeader>
            <div className='flex justify-between'>
              <Skeleton className='h-8 w-48 bg-[#2A2A3A]' />
              <Skeleton className='h-8 w-32 bg-[#2A2A3A]' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              <Skeleton className='h-24 w-full bg-[#2A2A3A]' />
              <Skeleton className='h-48 w-full bg-[#2A2A3A]' />
              <Skeleton className='h-32 w-full bg-[#2A2A3A]' />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-6 md:p-8 text-primary-text'>
        <Button
          variant='ghost'
          onClick={() => navigate('/orders')}
          className='mb-8 flex items-center gap-2 hover:bg-[#252536] text-[#E2E4F3]'>
          <ArrowLeft className='h-4 w-4' /> Back to Orders
        </Button>

        <div className='bg-[#3A1C1C] rounded-xl p-5 flex items-center gap-3'>
          <AlertCircle className='h-5 w-5 text-red-500' />
          <p className='text-red-500'>
            Error loading order details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const order = responseOrder?.data;
  const canCancelOrder = false;

  const getModalTitle = () => {
    if (modalType === 'cancel-item') return 'Cancel Item';
    if (modalType === 'cancel-order') return 'Cancel Order';
    if (modalType === 'return-item') return 'Return Item';
    return '';
  };

  const getModalDescription = () => {
    if (modalType === 'cancel-item')
      return 'Are you sure you want to cancel this item? This action cannot be undone.';
    if (modalType === 'cancel-order')
      return 'Are you sure you want to cancel the entire order? This action cannot be undone.';
    if (modalType === 'return-item')
      return 'Are you sure you want to return this item? Our team will review your request.';
    return '';
  };

  return (
    <div className='p-6 md:p-8 text-[#E2E4F3]'>
      <Button
        variant='ghost'
        onClick={() => navigate('/orders')}
        className='mb-8 flex items-center gap-2 hover:bg-[#252536] text-[#E2E4F3]'>
        <ArrowLeft className='h-4 w-4' /> Back to Orders
      </Button>

      <Card className='bg-[#1E1E2A] shadow-md rounded-xl overflow-hidden'>
        <CardHeader className='bg-[#252536] py-6 px-6'>
          <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
            <div className='space-y-2'>
              <CardTitle className='text-2xl flex items-center gap-2 text-[#E2E4F3]'>
                <Package className='h-5 w-5 text-[#6366F1]' />
                Order #{order._id.slice(-6)}
              </CardTitle>
              <div className='flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#A0A3BD]'>
                <div className='flex items-center gap-1.5'>
                  <Calendar className='h-3.5 w-3.5' />
                  <span>
                    Placed on{' '}
                    {new Date(order.placedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {order.deliveryBy && (
                  <div className='flex items-center gap-1.5'>
                    <Clock className='h-3.5 w-3.5' />
                    <span>
                      Delivery by{' '}
                      {new Date(order.deliveryBy).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className='flex flex-col md:items-end gap-2'>
              <div className='flex items-center gap-3'>
                <span className='font-bold text-xl text-[#E2E4F3]'>
                  ₹{order.finalPrice.toFixed(2)}
                </span>
                <StatusBadge status={order.orderStatus} />
              </div>
              <div className='flex flex-wrap gap-2.5 text-sm'>
                <Badge
                  variant='outline'
                  className='flex items-center gap-1.5 bg-transparent text-[#A0A3BD]'>
                  <CreditCard className='h-3 w-3' />
                  {order.paymentMethod}
                </Badge>
                <Badge
                  variant={
                    order.paymentStatus === 'Paid'
                      ? 'success'
                      : order.paymentStatus === 'Failed'
                      ? 'destructive'
                      : 'outline'
                  }
                  className='bg-transparent'>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-0'>
          <Tabs
            defaultValue='items'
            className='w-full'>
            <TabsList className='w-full bg-[#1E1E2A] rounded-none justify-start h-auto p-0'>
              <TabsTrigger
                value='items'
                className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent py-4 px-6 text-[#A0A3BD] data-[state=active]:text-[#E2E4F3]'>
                Items
              </TabsTrigger>
              <TabsTrigger
                value='shipping'
                className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent py-4 px-6 text-[#A0A3BD] data-[state=active]:text-[#E2E4F3]'>
                Shipping
              </TabsTrigger>
              <TabsTrigger
                value='payment'
                className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent py-4 px-6 text-[#A0A3BD] data-[state=active]:text-[#E2E4F3]'>
                Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value='items'
              className='p-6 space-y-6'>
              <div className='space-y-4'>
                {order.orderItems.map((item) => (
                  <div
                    key={item.product._id}
                    className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-5 bg-[#252536] rounded-xl'>
                    <div className='flex items-center gap-4'>
                      <div className='h-20 w-20 rounded-lg bg-[#2A2A3A] overflow-hidden'>
                        <img
                          src={item.product.images?.[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div>
                        <h3 className='font-medium mb-1.5 text-[#E2E4F3]'>
                          {item.product.name}
                        </h3>
                        <div className='flex flex-wrap gap-2.5 text-sm text-[#A0A3BD]'>
                          <span>Quantity: {item.quantity}</span>
                          <Badge
                            variant={
                              item.status === 'Delivered'
                                ? 'success'
                                : item.status === 'Cancelled'
                                ? 'destructive'
                                : 'outline'
                            }
                            className='text-xs bg-transparent'>
                            {item.status}
                          </Badge>
                        </div>
                        <div className='mt-2'>
                          <span className='font-medium text-[#E2E4F3]'>
                            ₹{item.price.toFixed(2)}
                          </span>
                          {item.discount > 0 && (
                            <span className='text-xs text-[#FF6B6B] ml-2'>
                              -₹{item.discount.toFixed(2)} discount
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flex sm:flex-col gap-2.5 sm:items-end'>
                      {/* Cancel Button */}
                      {(item.status === 'Pending' ||
                        item.status === 'Shipped') && (
                        <Button
                          variant='destructive'
                          size='sm'
                          className='bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-lg'
                          onClick={() => {
                            setModalType('cancel-item');
                            setIsModalOpen(true);
                            setSelectedProduct(item.product._id);
                          }}
                          disabled={isCancelling}>
                          Cancel Item
                        </Button>
                      )}

                      {/* Return Button */}
                      {item.status === 'Delivered' && (
                        <Button
                          variant='outline'
                          size='sm'
                          className='border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white rounded-lg'
                          onClick={() => {
                            setModalType('return-item');
                            setIsModalOpen(true);
                            setSelectedProduct(item.product._id);
                          }}>
                          <RotateCcw className='mr-1.5 h-3 w-3' />
                          Return
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {canCancelOrder && (
                <div className='flex justify-end mt-6'>
                  <Button
                    variant='destructive'
                    className='bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-lg'
                    onClick={() => {
                      setModalType('cancel-order');
                      setIsModalOpen(true);
                    }}
                    disabled={isCancelling}>
                    Cancel Entire Order
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value='shipping'
              className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-lg font-medium mb-4 flex items-center gap-2 text-[#E2E4F3]'>
                    <MapPin className='h-4 w-4 text-[#6366F1]' />
                    Shipping Address
                  </h3>
                  <Card className='bg-[#252536] shadow-md rounded-xl'>
                    <CardContent className='p-5'>
                      {order.shippingAddress ? (
                        <div className='space-y-2 text-[#E2E4F3]'>
                          <p className='font-medium'>
                            {order.shippingAddress.name}
                          </p>
                          <p>
                            {order.shippingAddress.street ||
                              order.shippingAddress.addressLine}
                          </p>
                          <p>
                            {order.shippingAddress.city},{' '}
                            {order.shippingAddress.state}{' '}
                            {order.shippingAddress.zipCode ||
                              order.shippingAddress.zip}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                          <p className='pt-1.5'>
                            Phone: {order.shippingAddress.phone}
                          </p>
                        </div>
                      ) : (
                        <p className='text-[#A0A3BD]'>
                          No shipping address available
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className='text-lg font-medium mb-4 flex items-center gap-2 text-[#E2E4F3]'>
                    <Truck className='h-4 w-4 text-[#6366F1]' />
                    Delivery Information
                  </h3>
                  <Card className='bg-[#252536] shadow-md rounded-xl'>
                    <CardContent className='p-5 space-y-3.5'>
                      <div className='flex justify-between'>
                        <span className='text-[#A0A3BD]'>Order Date:</span>
                        <span className='text-[#E2E4F3]'>
                          {new Date(order.placedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {order.deliveryBy && (
                        <div className='flex justify-between'>
                          <span className='text-[#A0A3BD]'>
                            Expected Delivery:
                          </span>
                          <span className='text-[#E2E4F3]'>
                            {new Date(order.deliveryBy).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <div className='flex justify-between'>
                        <span className='text-[#A0A3BD]'>Order Status:</span>
                        <StatusBadge status={order.orderStatus} />
                      </div>

                      {order.orderStatus === 'Delivered' && (
                        <div className='flex justify-between'>
                          <span className='text-[#A0A3BD]'>Delivered On:</span>
                          <span className='text-[#E2E4F3]'>
                            {new Date(order.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value='payment'
              className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-lg font-medium mb-4 flex items-center gap-2 text-[#E2E4F3]'>
                    <CreditCard className='h-4 w-4 text-[#6366F1]' />
                    Payment Information
                  </h3>
                  <Card className='bg-[#252536] shadow-md rounded-xl'>
                    <CardContent className='p-5 space-y-3.5'>
                      <div className='flex justify-between'>
                        <span className='text-[#A0A3BD]'>Payment Method:</span>
                        <span className='text-[#E2E4F3]'>
                          {order.paymentMethod}
                        </span>
                      </div>

                      <div className='flex justify-between'>
                        <span className='text-[#A0A3BD]'>Payment Status:</span>
                        <Badge
                          variant={
                            order.paymentStatus === 'Paid'
                              ? 'success'
                              : order.paymentStatus === 'Failed'
                              ? 'destructive'
                              : 'outline'
                          }
                          className='bg-transparent'>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className='text-lg font-medium mb-4 flex items-center gap-2 text-[#E2E4F3]'>
                    <ShoppingBag className='h-4 w-4 text-[#6366F1]' />
                    Order Summary
                  </h3>
                  <Card className='bg-[#252536] shadow-md rounded-xl'>
                    <CardContent className='p-5 space-y-3.5'>
                      <div className='flex justify-between'>
                        <span className='text-[#A0A3BD]'>Subtotal:</span>
                        <span className='text-[#E2E4F3]'>
                          ₹{order.totalAmount.toFixed(2)}
                        </span>
                      </div>

                      {order.totalDiscount > 0 && (
                        <div className='flex justify-between'>
                          <span className='text-[#A0A3BD]'>Item Discount:</span>
                          <span className='text-[#FF6B6B]'>
                            -₹{order.totalDiscount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {order.couponCode && (
                        <div className='flex justify-between'>
                          <span className='text-[#A0A3BD]'>
                            Coupon Discount ({order.couponCode}):
                          </span>
                          <span className='text-[#FF6B6B]'>
                            -₹{order.couponDiscount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {order.refundedAmount > 0 && (
                        <div className='flex justify-between'>
                          <span className='text-[#A0A3BD]'>
                            Refunded Amount:
                          </span>
                          <span className='text-[#4CAF50]'>
                            ₹{order.refundedAmount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <Separator className='my-2 bg-[#2A2A3A]' />

                      <div className='flex justify-between font-bold'>
                        <span className='text-[#E2E4F3]'>Total:</span>
                        <span className='text-[#E2E4F3]'>
                          ₹{order.finalPrice.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title={getModalTitle()}
        description={getModalDescription()}
        onConfirm={handleConfirmAction}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      {isCancelError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={
            cancelError?.data?.message ||
            'Something went wrong! Please try again.'
          }
        />
      )}
    </div>
  );
};
