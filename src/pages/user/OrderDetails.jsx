import {
  useGetOrderQuery,
  useCancelOrderMutation,
  useRequestReturnOrderMutation,
  useRetryPaymentMutation,
  useVerifyRazorpayMutation,
  useDownloadInvoicePDFMutation,
} from '@/redux/api/user/ordersApi';
import { showToast } from '@/utils';
import { handleApiError } from '@/utils';
import { useState } from 'react';
import { Alert, PageTransition, StatusBadge } from '@/components/common';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shadcn/components/ui/tabs';
import { useUsers } from '@/hooks';
import { OrderDetailsLoading } from '@/components/error';
import { OrderDetailsError } from '@/components/error/OrderDetailsError';
import { format } from 'date-fns';

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const user = useUsers();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('cancel-item');

  const {
    data: responseOrder,
    isLoading,
    isError,
  } = useGetOrderQuery({ orderId });

  const [
    cancelOrder,
    { isLoading: isCancelling, isError: isCancelError, error: cancelError },
  ] = useCancelOrderMutation();

  const [retryPayment, { isLoading: isRetrying }] = useRetryPaymentMutation();
  const [verifyRazorpay] = useVerifyRazorpayMutation();
  const [requestReturnOrder] = useRequestReturnOrderMutation();
  const [downloadInvoicePDF] = useDownloadInvoicePDFMutation();

  const handleCancelItem = async () => {
    setIsModalOpen(false);

    try {
      const response = await cancelOrder({
        orderId,
        productId: selectedProduct,
      }).unwrap();

      if (response?.success) {
        showToast.success(response?.message, {
          duration: 1500,
        });
      }
    } catch (error) {
      handleApiError(error, 'Failed to cancel item');
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
        showToast.success(response?.message, {
          duration: 1500,
        });
      }
    } catch (error) {
      handleApiError(error, 'Failed to cancel order');
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
        showToast.success(response?.message, {
          duration: 1500,
        });
      }
    } catch (error) {
      handleApiError(error, 'Failed to return order');
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

  const handleRetryPayment = async () => {
    try {
      const response = await retryPayment({
        orderId: order._id,
        paymentMethod: 'Razorpay',
      }).unwrap();

      if (response?.success) {
        showToast.success('Payment retry initiated!');
        const options = {
          key: import.meta.env.VITE_RZP_KEY_ID,
          amount: response.data.amount,
          currency: response.data.currency,
          name: 'GameStash',
          description: 'GameStash Payment',
          order_id: response?.data?.razorpayOrderId,
          handler: async function (razorpayResponse) {
            const paymentData = {
              orderId: response?.data?.orderId,
              razorpayOrderId: razorpayResponse?.razorpay_order_id,
              paymentId: razorpayResponse?.razorpay_payment_id,
              signature: razorpayResponse?.razorpay_signature,
            };

            try {
              const paymentResponse = await verifyRazorpay(
                paymentData
              ).unwrap();

              if (paymentResponse?.success) {
                showToast.success('Payment successful!');
              }
            } catch (error) {
              handleApiError(error, 'Payment verification failed.');
            }
          },
          theme: { color: '#3399cc' },
          prefill: {
            name: user?.userInfo?.name,
            email: user?.userInfo?.email,
            contact: '+919876543210',
          },
          retry: {
            enabled: false,
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      handleApiError(error, 'Failed to retry payment.');
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const url = await downloadInvoicePDF(orderId).unwrap();

      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      showToast.success(`Report downloading as PDF`);
    } catch (error) {
      handleApiError(error, 'Failed to download report');
    }
  };

  if (isLoading) {
    return <OrderDetailsLoading />;
  }

  if (isError) {
    return <OrderDetailsError />;
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
    <PageTransition>
      <div className=' text-primary-text'>
        <Button
          variant='ghost'
          onClick={() => navigate('/orders')}
          className='mb-8 flex items-center gap-2 hover:bg-secondary text-primary-text'>
          <ArrowLeft className='h-4 w-4' /> Back to Orders
        </Button>

        <Card className='bg-secondary-bg shadow-md rounded-xl overflow-hidden border-0'>
          <CardHeader className='bg-secondary-bg py-6 px-6'>
            <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
              <div className='space-y-2'>
                <CardTitle className='text-2xl flex items-center gap-2 text-secondary-text'>
                  <Package className='h-5 w-5 text-primary-text' />
                  Order #{order._id.slice(-6)}
                </CardTitle>
                <div className='flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-secondary-text'>
                  <div className='flex items-center gap-1.5'>
                    <Calendar className='h-3.5 w-3.5' />
                    <span>
                      Placed on{' '}
                      {format(new Date(order.placedAt), 'MMMM d, yyyy')}
                    </span>
                  </div>

                  {order.deliveryBy && (
                    <div className='flex items-center gap-1.5'>
                      <Clock className='h-3.5 w-3.5' />
                      <span>
                        Delivery by{' '}
                        {format(new Date(order.deliveryBy), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className='flex flex-col md:items-end gap-2'>
                <div className='flex items-center gap-3'>
                  <span className='font-bold text-xl text-primary-text'>
                    ₹{order.finalPrice.toFixed(2)}
                  </span>
                  <StatusBadge status={order.orderStatus} />
                </div>
                <div className='flex flex-wrap gap-2.5 text-sm'>
                  <Badge
                    variant='outline'
                    className='flex items-center gap-1.5 bg-white text-black'>
                    <CreditCard className='h-3 w-3' />
                    {order.paymentMethod}
                  </Badge>
                  <Badge
                    variant={
                      order.paymentStatus === 'Paid'
                        ? 'success'
                        : order.paymentStatus === 'Failed'
                        ? 'destructive'
                        : 'secondary'
                    }>
                    {order.paymentStatus}
                  </Badge>
                </div>
                <Button
                  variant='ghost'
                  onClick={() => handleDownloadInvoice()}
                  className='bg-accent-blue m-2 hover:bg-hover-blue'>
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className='p-0'>
            <Tabs
              defaultValue='items'
              className='w-full'>
              <TabsList className='w-full bg-secondary-bg rounded-none justify-start h-auto p-0'>
                <TabsTrigger
                  value='items'
                  className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-text data-[state=active]:bg-transparent py-4 px-6 text-secondary-text data-[state=active]:text-primary-text'>
                  Items
                </TabsTrigger>
                <TabsTrigger
                  value='shipping'
                  className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-text data-[state=active]:bg-transparent py-4 px-6 text-secondary-text data-[state=active]:text-primary-text'>
                  Shipping
                </TabsTrigger>
                <TabsTrigger
                  value='payment'
                  className='rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-text data-[state=active]:bg-transparent py-4 px-6 text-secondary-text data-[state=active]:text-primary-text'>
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
                      className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-5 bg-primary-bg/60 rounded-xl'>
                      <div className='flex items-center gap-4'>
                        <div className='h-20 w-20 rounded-lg bg-secondary-bg overflow-hidden'>
                          <img
                            src={item.product.images?.[0] || '/placeholder.svg'}
                            alt={item.product.name}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div>
                          <h3 className='font-medium mb-1.5 text-primary-text'>
                            {item.product.name}
                          </h3>
                          <div className='flex flex-wrap gap-2.5 text-sm text-secondary-text'>
                            <span>Quantity: {item.quantity}</span>
                            <Badge
                              variant={
                                item.status === 'Delivered'
                                  ? 'success'
                                  : item.status === 'Cancelled'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                              className='text-xs'>
                              {item.status}
                            </Badge>
                          </div>
                          <div className='mt-2 flex flex-wrap items-center gap-2'>
                            {/* Show original price per unit if there's a discount */}
                            {item.totalPrice / item.quantity < item.price ? (
                              <>
                                <span className='line-through text-secondary-text'>
                                  ₹{item.price.toFixed(2)}
                                </span>
                                <span className='font-medium text-primary-text'>
                                  ₹
                                  {(item.totalPrice / item.quantity).toFixed(2)}{' '}
                                  per item
                                </span>
                              </>
                            ) : (
                              <span className='font-medium text-primary-text'>
                                ₹{item.price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Show total savings and final price */}
                          <div className='mt-1'>
                            {item.totalPrice < item.price * item.quantity && (
                              <span className='text-xs text-[#FF6B6B]'>
                                Saved ₹
                                {(
                                  item.price * item.quantity -
                                  item.totalPrice
                                ).toFixed(2)}{' '}
                                on this item
                              </span>
                            )}
                            <div className='mt-1 font-medium text-primary-text'>
                              Total: ₹{item.totalPrice.toFixed(2)}
                            </div>
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
                            className='bg-accent-red hover:bg-hover-red text-white rounded-lg'
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
                            className='bg-accent-blue border-none text-primary-text hover:bg-hover-blue hover:scale-105 transition-all hover:text-primary-text rounded-lg'
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

                {order.paymentStatus === 'Failed' &&
                  order.paymentMethod === 'Razorpay' && (
                    <Button
                      onClick={handleRetryPayment}
                      disabled={isRetrying}
                      variant='destructive'>
                      Retry Payment
                    </Button>
                  )}
              </TabsContent>

              <TabsContent
                value='shipping'
                className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h3 className='text-lg font-medium mb-4 flex items-center gap-2 text-primary-text'>
                      <MapPin className='h-4 w-4 text-primary-text' />
                      Shipping Address
                    </h3>
                    <Card className='bg-primary-bg/60 border-none shadow-md rounded-xl'>
                      <CardContent className='p-5'>
                        {order.shippingAddress ? (
                          <div className='space-y-2 text-primary-text'>
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
                              Phone: {order.shippingAddress.phone || 'N/A'}
                            </p>
                          </div>
                        ) : (
                          <p className='text-secondary-text'>
                            No shipping address available
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className='text-lg font-medium mb-4 flex items-center gap-2 text-primary-text'>
                      <Truck className='h-4 w-4 text-primary-text' />
                      Delivery Information
                    </h3>
                    <Card className='bg-primary-bg/60 border-none shadow-md rounded-xl'>
                      <CardContent className='p-5 space-y-3.5'>
                        <div className='flex justify-between'>
                          <span className='text-secondary-text'>
                            Order Date:
                          </span>
                          <span className='text-primary-text'>
                            {format(new Date(order.placedAt), 'yyyy-MM-dd')}
                          </span>
                        </div>

                        {order?.deliveryBy && (
                          <div className='flex justify-between'>
                            <span className='text-secondary-text'>
                              Expected Delivery:
                            </span>
                            <span className='text-primary-text'>
                              {format(new Date(order.deliveryBy), 'yyyy-MM-dd')}
                            </span>
                          </div>
                        )}

                        <div className='flex justify-between'>
                          <span className='text-secondary-text'>
                            Order Status:
                          </span>
                          <StatusBadge status={order.orderStatus} />
                        </div>

                        {order.orderStatus === 'Delivered' && (
                          <div className='flex justify-between'>
                            <span className='text-secondary-text'>
                              Delivered On:
                            </span>
                            <span className='text-primary-text'>
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
                    <h3 className='text-lg font-medium mb-4 flex items-center gap-2 text-primary-text'>
                      <CreditCard className='h-4 w-4 text-primary-text' />
                      Payment Information
                    </h3>
                    <Card className='bg-primary-bg/60 border-none shadow-md rounded-xl'>
                      <CardContent className='p-5 space-y-3.5'>
                        <div className='flex justify-between'>
                          <span className='text-secondary-text'>
                            Payment Method:
                          </span>
                          <span className='text-primary-text'>
                            {order.paymentMethod}
                          </span>
                        </div>

                        <div className='flex justify-between'>
                          <span className='text-secondary-text'>
                            Payment Status:
                          </span>
                          <Badge
                            variant={
                              order.paymentStatus === 'Paid'
                                ? 'success'
                                : order.paymentStatus === 'Failed'
                                ? 'destructive'
                                : 'secondary'
                            }>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className='text-lg font-medium mb-4 flex items-center gap-2 text-primary-text'>
                      <ShoppingBag className='h-4 w-4 text-primary-text' />
                      Order Summary
                    </h3>
                    <Card className='bg-primary-bg/60 border-none shadow-md rounded-xl'>
                      <CardContent className='p-5 space-y-3.5'>
                        <div className='flex justify-between'>
                          <span className='text-secondary-text'>Subtotal:</span>
                          <span className='text-primary-text'>
                            ₹{order.totalAmount.toFixed(2)}
                          </span>
                        </div>

                        {order.couponCode && (
                          <div className='flex justify-between'>
                            <span className='text-secondary-text'>
                              Coupon Discount ({order.couponCode}):
                            </span>
                            <span className='text-[#FF6B6B]'>
                              -₹{order.couponDiscount.toFixed(2)}
                            </span>
                          </div>
                        )}

                        {order.totalDiscount > 0 && (
                          <div className='flex justify-between'>
                            <span className='text-secondary-text'>
                              Total Discount:
                            </span>
                            <span className='text-[#FF6B6B]'>
                              -₹{order.totalDiscount.toFixed(2)}
                            </span>
                          </div>
                        )}

                        {order.refundedAmount > 0 && (
                          <div className='flex justify-between'>
                            <span className='text-secondary-text'>
                              Refunded Amount:
                            </span>
                            <span className='text-[#4CAF50]'>
                              ₹{order.refundedAmount.toFixed(2)}
                            </span>
                          </div>
                        )}

                        <Separator className='my-2 bg-secondary-bg' />

                        <div className='flex justify-between font-bold'>
                          <span className='text-primary-text'>Total:</span>
                          <span className='text-primary-text'>
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
    </PageTransition>
  );
};
