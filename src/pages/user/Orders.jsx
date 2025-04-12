import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import {
  Clock,
  Package,
  Calendar,
  CreditCard,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import {
  useGetOrdersQuery,
  useCancelOrderMutation,
} from '@/redux/api/user/ordersApi';

import { Badge } from '@/shadcn/components/ui/badge';
import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';
import { Separator } from '@/shadcn/components/ui/separator';
import { PageTransition, StatusBadge } from '@/components/common';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '@/components/common';
import { OrdersListError, OrdersListLoading } from '@/components/error';
import { handleApiError, showToast } from '@/utils';

export const Orders = () => {
  const navigate = useNavigate();

  const { data: responseOrders, isLoading, isError } = useGetOrdersQuery({});
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      const response = await cancelOrder({
        orderId: selectedOrderId,
      }).unwrap();

      if (response?.success) {
        showToast.success(response?.message);
      }
    } catch (error) {
      handleApiError(error, 'Failed to cancel order');
    } finally {
      setIsModalOpen(false);
      setSelectedOrderId(null);
    }
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (isLoading) {
    return <OrdersListLoading />;
  }

  if (isError) {
    return <OrdersListError />;
  }

  const hasOrders = responseOrders?.data?.orders?.length > 0;

  return (
    <PageTransition>
      <div className='text-primary-text'>
        <h1 className='text-3xl font-bold mb-8'>Your Orders</h1>

        {!hasOrders ? (
          <div className='bg-secondary-bg/50 p-10 rounded-xl text-center shadow-md'>
            <ShoppingBag className='h-14 w-14 mx-auto mb-5 text-primary-text' />
            <h2 className='text-2xl font-semibold mb-3'>No orders yet</h2>
            <p className='text-primary-text mb-7 max-w-md mx-auto'>
              You haven&apos;t placed any orders yet.
            </p>
            <Button
              onClick={() => navigate('/')}
              className='bg-accent-red hover:bg-hover-red text-white px-6 py-2.5 rounded-lg'>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className='space-y-6'>
            {responseOrders?.data?.orders.map((order) => (
              <Card
                key={order._id}
                className='bg-secondary-bg shadow-md hover:shadow-lg transition-shadow duration-300 border-none rounded-xl overflow-hidden'>
                <CardHeader className='bg-secondary-bg py-5 px-6'>
                  <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4'>
                    <div className='space-y-1.5'>
                      <CardTitle className='flex items-center gap-2 text-[#E2E4F3]'>
                        <Package className='h-4 w-4 text-[#6366F1]' />
                        Order #{order?._id.slice(-6)}
                      </CardTitle>
                      <div className='flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#A0A3BD]'>
                        <div className='flex items-center gap-1.5'>
                          <Calendar className='h-3.5 w-3.5' />
                          <span>
                            {new Date(order?.placedAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                          <CreditCard className='h-3.5 w-3.5' />
                          <span>{order?.paymentMethod}</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                          <Clock className='h-3.5 w-3.5' />
                          <span>
                            {order?.deliveryBy
                              ? `Delivery by ${new Date(
                                  order?.deliveryBy
                                ).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}`
                              : 'Processing'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col sm:items-end gap-1.5'>
                      <div className='flex items-center gap-3'>
                        <span className='font-bold text-lg text-[#E2E4F3]'>
                          ₹{order?.finalPrice.toFixed(2)}
                        </span>
                        <StatusBadge status={order?.orderStatus} />
                      </div>
                      <span className='text-sm text-[#A0A3BD]'>
                        Payment:
                        <Badge
                          variant={
                            order?.paymentStatus === 'Paid'
                              ? 'success'
                              : order?.paymentStatus === 'Pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className='ml-1'>
                          {order?.paymentStatus}
                        </Badge>
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='pt-5 px-6 pb-6'>
                  <div className='space-y-4'>
                    {order?.orderItems?.slice(0, 2).map((item) => (
                      <div
                        key={item?.product?._id}
                        className='flex justify-between items-center py-2.5'>
                        <div className='flex items-center gap-4'>
                          <div className='h-16 w-16 rounded-lg bg-[#252536] overflow-hidden'>
                            <img
                              src={
                                item?.product?.images?.[0] || '/placeholder.svg'
                              }
                              alt={item?.product?.name}
                              className='h-full w-full object-cover'
                            />
                          </div>
                          <div>
                            <p className='font-medium line-clamp-1 text-[#E2E4F3]'>
                              {item?.product?.name}
                            </p>
                            <div className='flex items-center gap-2.5 text-sm text-[#A0A3BD] mt-1'>
                              <span>Qty: {item?.quantity}</span>
                              {item?.status && (
                                <Badge
                                  variant={
                                    item?.status === 'Delivered'
                                      ? 'success'
                                      : item?.status === 'Cancelled'
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                  className='text-xs'>
                                  {item?.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className='text-right'>
                          {/* Display price information */}
                          {item?.price !== item?.totalPrice / item?.quantity ? (
                            <>
                              {/* If there's a discount */}
                              <p className='text-xs text-[#FF6B6B] line-through'>
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className='text-xs text-[#FF6B6B]'>
                                Saved ₹
                                {(
                                  item.price * item.quantity -
                                  item.totalPrice
                                ).toFixed(2)}
                              </p>
                              <p className='font-medium text-[#E2E4F3]'>
                                ₹{item.totalPrice.toFixed(2)}
                              </p>
                            </>
                          ) : (
                            /* If there's no discount */
                            <p className='font-medium text-[#E2E4F3]'>
                              ₹{item.totalPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {order?.orderItems.length > 2 && (
                      <p className='text-sm text-[#A0A3BD] pt-1'>
                        + {order?.orderItems.length - 2} more item(s)
                      </p>
                    )}
                  </div>

                  <Separator className='my-5 bg-[#2A2A3A]' />

                  <div className='flex justify-between items-center'>
                    <Button
                      variant='outline'
                      className='bg-accent-blue text-primary-text hover:text-primary-text hover:bg-accent-blue/90 border-none rounded-lg'
                      onClick={() => handleOrderClick(order._id)}>
                      View Details <ChevronRight className='ml-1 h-4 w-4' />
                    </Button>

                    {(order.orderStatus === 'Processing' ||
                      order.orderStatus === 'Shipped') && (
                      <Button
                        variant='destructive'
                        className='bg-accent-red hover:bg-hover-red text-white rounded-lg'
                        onClick={() => {
                          setSelectedOrderId(order._id);
                          setIsModalOpen(true);
                        }}
                        disabled={isCancelling}>
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ConfirmationModal
          isOpen={isModalOpen}
          title='Cancel Order'
          description='Are you sure you want to cancel this entire order? This action cannot be undone.'
          onConfirm={handleCancelOrder}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrderId(null);
          }}
        />
      </div>
    </PageTransition>
  );
};
