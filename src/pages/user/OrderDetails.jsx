import {
  useGetOrderQuery,
  useCancelOrderMutation,
} from '@/redux/api/user/ordersApi';
import { toast } from 'sonner';
import { useState } from 'react';
import { StatusBadge } from '@/components/common';
import { ConfirmationModal } from '@/components/common';
import { useParams, useNavigate } from 'react-router-dom';

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(selectedProduct);
  const {
    data: responseOrder,
    isLoading,
    isError,
  } = useGetOrderQuery({ orderId });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const handleCancelOrder = async () => {
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
      toast.error('Failed to cancel order');
      console.log(error);
    }
  };

  const handleReturnOrder = () => {
    toast.success('Return request submitted successfully');
  };

  if (isLoading)
    return <div className='p-4 text-center'>Loading order details...</div>;

  if (isError)
    return (
      <div className='p-4 text-center text-red-500'>
        Error loading order details
      </div>
    );

  return (
    <div className='p-6 bg-primary-bg min-h-screen'>
      <button
        onClick={() => navigate('/orders')}
        className='mb-6 text-primary-text'>
        ← Back to Orders
      </button>
      <div className='bg-secondary-bg text-primary-text p-6 rounded-lg shadow-sm'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h1 className='text-2xl font-bold'>
              Order #{responseOrder?.data?._id.slice(-6)}
            </h1>
            <p className='text-gray-500'>
              Placed on{' '}
              {new Date(responseOrder?.data?.placedAt).toLocaleDateString()}
            </p>
            <p className='text-gray-500'>
              Delivery by:{' '}
              {responseOrder?.data?.deliveryBy
                ? new Date(responseOrder?.data?.deliveryBy).toLocaleDateString()
                : 'Not specified'}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-2xl font-bold'>
              ₹{responseOrder?.data?.finalPrice.toFixed(2)}
            </p>
            <p className='text-lg py-2'>
              <StatusBadge status={responseOrder?.data?.orderStatus} />
            </p>
            <p className='text-gray-500'>
              Payment: {responseOrder?.data?.paymentMethod}
            </p>
            <p className='text-gray-500'>
              Payment Status: {responseOrder?.data?.paymentStatus}
            </p>
          </div>
        </div>

        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Order Items</h2>
          <div className='space-y-4'>
            {responseOrder?.data?.orderItems.map((item) => (
              <div
                key={item.product._id}
                className='flex justify-between items-center py-2'>
                <div className='flex items-center space-x-4'>
                  <img
                    src={item.product.images?.[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    className='w-16 h-16 object-cover rounded'
                  />
                  <div>
                    <p className='font-medium'>{item.product.name}</p>
                    <p className='text-gray-500'>Quantity: {item.quantity}</p>
                    <p className='text-gray-500'>
                      Status:{' '}
                      <StatusBadge
                        status={item.status || responseOrder?.data?.orderStatus}
                      />
                    </p>
                  </div>
                </div>

                <div className='space-y-4 text-right'>
                  <p className='font-medium'>₹{item.price.toFixed(2)}</p>
                  <div className='flex justify-end space-x-4'>
                    {/* Cancel Button */}
                    {item?.status === 'Pending' ||
                    item?.status === 'Shipped' ? (
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setSelectedProduct(item.product._id);
                        }}
                        disabled={isCancelling}
                        className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50'>
                        {isCancelling ? 'Cancelling...' : 'Cancel Item'}
                      </button>
                    ) : null}

                    {/* Return Button */}
                    {item?.status === 'Delivered' ? (
                      <button
                        onClick={handleReturnOrder}
                        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'>
                        Return Item
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Order Summary</h2>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <p>Subtotal</p>
              <p>₹{responseOrder?.data?.totalAmount.toFixed(2)}</p>
            </div>
            <div className='flex justify-between'>
              <p>Discount</p>
              <p>-₹{responseOrder?.data?.totalDiscount.toFixed(2)}</p>
            </div>
            {responseOrder?.data?.couponCode && (
              <div className='flex justify-between'>
                <p>Coupon Discount ({responseOrder?.data?.couponCode})</p>
                <p>-₹{responseOrder?.data?.couponDiscount.toFixed(2)}</p>
              </div>
            )}
            {responseOrder?.data?.refundedAmount > 0 && (
              <div className='flex justify-between'>
                <p>Refunded Amount</p>
                <p>-₹{responseOrder?.data?.refundedAmount.toFixed(2)}</p>
              </div>
            )}
            <div className='flex justify-between font-bold'>
              <p>Total</p>
              <p>₹{responseOrder?.data?.finalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Shipping Address</h2>
          <p>{responseOrder?.data?.shippingAddress?.addressName}</p>
          <p>{responseOrder?.data?.shippingAddress?.addressLine}</p>
          <p>
            {responseOrder?.data?.shippingAddress?.city},{' '}
            {responseOrder?.data?.shippingAddress?.state}{' '}
            {responseOrder?.data?.shippingAddress?.zip}
          </p>
          <p>{responseOrder?.data?.shippingAddress?.country}</p>
        </div>
      </div>

      {
        // Cancel Order Modal
        <ConfirmationModal
          isOpen={isModalOpen}
          title='Cancel Order'
          description='Are you sure you want to cancel this order?'
          onConfirm={handleCancelOrder}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      }
    </div>
  );
};
