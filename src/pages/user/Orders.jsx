import { useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '@/redux/api/user/ordersApi';
import { StatusBadge } from '@/components/common';

export const Orders = () => {
  const { data: responseOrders, isLoading, isError } = useGetOrdersQuery({});
  const navigate = useNavigate();

  if (isLoading)
    return <div className='p-4 text-center'>Loading orders...</div>;

  if (isError)
    return (
      <div className='p-4 text-center text-red-500'>Error loading orders</div>
    );

  return (
    <div className='p-6 text-primary-text'>
      <h1 className='text-3xl font-bold mb-6'>Your Orders</h1>
      <div className='space-y-6'>
        {responseOrders?.data?.orders.map((order) => (
          <div
            key={order._id}
            className='bg-secondary-bg p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer'
            onClick={() => navigate(`/orders/${order._id}`)}>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <p className='text-lg font-semibold'>
                  Order #{order._id.slice(-6)}
                </p>
                <p className='text-sm text-gray-500'>
                  Placed on {new Date(order.placedAt).toLocaleDateString()}
                </p>
              </div>
              <div className='text-right items-end'>
                <p className='text-lg font-bold'>
                  ₹{order.finalPrice.toFixed(2)}
                </p>
                <p className='text-sm py-2'>
                  <StatusBadge status={order.orderStatus} />
                </p>
              </div>
            </div>
            <div className='space-y-2'>
              {order.orderItems.map((item) => (
                <div
                  key={item.product._id}
                  className='flex justify-between items-center'>
                  <div className='flex items-center space-x-4'>
                    <img
                      src={item.product.images?.[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className='w-12 h-12 object-cover rounded'
                    />
                    <div>
                      <p className='font-medium'>{item.product.name}</p>
                      <p className='text-sm text-gray-500'>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p>₹{item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
