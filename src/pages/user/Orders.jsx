'use client';

import { useNavigate } from 'react-router-dom';
import {
  useGetOrdersQuery,
  useCancelOrderMutation,
} from '@/redux/api/user/ordersApi';
import { StatusBadge } from '@/components/common';
import { useState } from 'react';
import { ConfirmationModal } from '@/components/common';
import { toast } from 'sonner';
import {
  Package,
  Calendar,
  CreditCard,
  Clock,
  ChevronRight,
  ShoppingBag,
  AlertCircle,
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

export const Orders = () => {
  const { data: responseOrders, isLoading, isError } = useGetOrdersQuery({});
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      const response = await cancelOrder({
        orderId: selectedOrderId,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message, {
          duration: 1500,
        });
      }
    } catch (error) {
      toast.error('Failed to cancel order');
      console.log(error);
    } finally {
      setIsModalOpen(false);
      setSelectedOrderId(null);
    }
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className='p-6 md:p-8 text-primary-text'>
        <h1 className='text-3xl font-bold mb-8'>Your Orders</h1>
        <div className='space-y-6'>
          {[1, 2].map((i) => (
            <Card
              key={i}
              className='bg-[#1E1E2A] shadow-md'>
              <CardHeader className='pb-2'>
                <div className='flex justify-between'>
                  <Skeleton className='h-6 w-32 bg-[#2A2A3A]' />
                  <Skeleton className='h-6 w-24 bg-[#2A2A3A]' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex justify-between'>
                    <div className='flex gap-4'>
                      <Skeleton className='h-16 w-16 rounded bg-[#2A2A3A]' />
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-40 bg-[#2A2A3A]' />
                        <Skeleton className='h-4 w-20 bg-[#2A2A3A]' />
                      </div>
                    </div>
                    <Skeleton className='h-6 w-16 bg-[#2A2A3A]' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-6 md:p-8 text-primary-text'>
        <div className='bg-[#3A1C1C] rounded-lg p-5 flex items-center gap-3'>
          <AlertCircle className='h-5 w-5 text-red-500' />
          <p className='text-red-500'>
            Error loading orders. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const hasOrders = responseOrders?.data?.orders?.length > 0;

  return (
    <div className='p-6 md:p-8 text-primary-text'>
      <h1 className='text-3xl font-bold mb-8'>Your Orders</h1>

      {!hasOrders ? (
        <div className='bg-[#1E1E2A] p-10 rounded-xl text-center shadow-md'>
          <ShoppingBag className='h-14 w-14 mx-auto mb-5 text-[#6C7293]' />
          <h2 className='text-2xl font-semibold mb-3'>No orders yet</h2>
          <p className='text-[#A0A3BD] mb-7 max-w-md mx-auto'>
            You haven&apos;t placed any orders yet.
          </p>
          <Button
            onClick={() => navigate('/')}
            className='bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6 py-2.5 rounded-lg'>
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className='space-y-6'>
          {responseOrders?.data?.orders.map((order) => (
            <Card
              key={order._id}
              className='bg-[#1E1E2A] shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden'>
              <CardHeader className='bg-[#252536] py-5 px-6'>
                <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4'>
                  <div className='space-y-1.5'>
                    <CardTitle className='flex items-center gap-2 text-[#E2E4F3]'>
                      <Package className='h-4 w-4 text-[#6366F1]' />
                      Order #{order._id.slice(-6)}
                    </CardTitle>
                    <div className='flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#A0A3BD]'>
                      <div className='flex items-center gap-1.5'>
                        <Calendar className='h-3.5 w-3.5' />
                        <span>
                          {new Date(order.placedAt).toLocaleDateString(
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
                        <span>{order.paymentMethod}</span>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <Clock className='h-3.5 w-3.5' />
                        <span>
                          {order.deliveryBy
                            ? `Delivery by ${new Date(
                                order.deliveryBy
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
                        ₹{order.finalPrice.toFixed(2)}
                      </span>
                      <StatusBadge status={order.orderStatus} />
                    </div>
                    <span className='text-sm text-[#A0A3BD]'>
                      Payment:{' '}
                      <Badge
                        variant={
                          order.paymentStatus === 'Paid' ? 'success' : 'outline'
                        }
                        className='ml-1 bg-transparent'>
                        {order.paymentStatus}
                      </Badge>
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='pt-5 px-6 pb-6'>
                <div className='space-y-4'>
                  {/* Show first 2 items, then a count of remaining items */}
                  {order.orderItems.slice(0, 2).map((item) => (
                    <div
                      key={item.product._id}
                      className='flex justify-between items-center py-2.5'>
                      <div className='flex items-center gap-4'>
                        <div className='h-16 w-16 rounded-lg bg-[#252536] overflow-hidden'>
                          <img
                            src={item.product.images?.[0] || '/placeholder.svg'}
                            alt={item.product.name}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div>
                          <p className='font-medium line-clamp-1 text-[#E2E4F3]'>
                            {item.product.name}
                          </p>
                          <div className='flex items-center gap-2.5 text-sm text-[#A0A3BD] mt-1'>
                            <span>Qty: {item.quantity}</span>
                            {item.status && (
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
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium text-[#E2E4F3]'>
                          ₹{item.price.toFixed(2)}
                        </p>
                        {item.discount > 0 && (
                          <p className='text-xs text-[#FF6B6B] mt-0.5'>
                            -₹{item.discount.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {order.orderItems.length > 2 && (
                    <p className='text-sm text-[#A0A3BD] pt-1'>
                      + {order.orderItems.length - 2} more item(s)
                    </p>
                  )}
                </div>

                <Separator className='my-5 bg-[#2A2A3A]' />

                <div className='flex justify-between items-center'>
                  <Button
                    variant='outline'
                    className='border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white rounded-lg'
                    onClick={() => handleOrderClick(order._id)}>
                    View Details <ChevronRight className='ml-1 h-4 w-4' />
                  </Button>

                  {(order.orderStatus === 'Processing' ||
                    order.orderStatus === 'Shipped') && (
                    <Button
                      variant='destructive'
                      className='bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-lg'
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

      {/* Cancel Order Modal */}
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
  );
};
