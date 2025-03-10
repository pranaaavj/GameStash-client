import { useEffect, useState } from 'react';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveItemFromCartMutation,
} from '@/redux/api/user/cartApi';
import { ScrollArea } from '@/shadcn/components/ui/scroll-area';
import { Separator } from '@/shadcn/components/ui/separator';
import { Button } from '@/shadcn/components/ui/button';
import { X, Plus, Minus, ShoppingCart, Lock } from 'lucide-react';
import { useUsers } from '@/hooks';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const user = useUsers();
  const navigate = useNavigate();

  const { data: responseCart, isError: isCartError } = useGetCartQuery(
    user?.userInfo?.id,
    { skip: !user?.userInfo?.id }
  );

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeItemFromCart] = useRemoveItemFromCartMutation();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (responseCart) {
      setCartItems(responseCart.data.items);
      setTotal(responseCart.data.total);
    }
  }, [responseCart]);

  const debouncedUpdateQuantity = useDebouncedCallback(
    async (productId, quantity) => {
      try {
        const response = await updateCartItem({ productId, quantity }).unwrap();

        if (response?.success) {
          setCartItems(response.data.items);
          setTotal(response.data.total);
        }
      } catch (error) {
        console.error('Failed to update cart item:', error);
      }
    },
    700
  );

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity >= 5) {
      toast.error('Maximum quantity reached.');
      return;
    }
    if (quantity < 1) return;

    const item = cartItems.find((item) => item.product._id === productId);
    if (item && item.product.stock < quantity) {
      toast.error('Insufficient stock.');
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );

    debouncedUpdateQuantity(productId, quantity);
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await removeItemFromCart(productId).unwrap();
      if (response?.success) {
        setCartItems(response.data.items);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout', { state: { isCheckoutAllowed: true } });
    } else {
      toast.error('Your cart is empty!');
    }
  };

  if (isCartError) {
    console.log('Cart error occurred');
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
      {/* <Button
        variant='ghost'
        className='mb-6 text-secondary-text hover:text-primary-text'
        onClick={() => navigate(-1)}>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Continue Shopping
      </Button> */}
      <h1 className='text-4xl font-bold mb-8 text-primary-text'>Your Cart</h1>
      {user?.userInfo ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <ScrollArea className='h-[calc(100vh-250px)] pr-4'>
              <AnimatePresence initial={false}>
                {cartItems?.length > 0 ? (
                  <motion.div className='space-y-6'>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item._id}
                        className='flex gap-6 bg-secondary-bg p-6 rounded-lg shadow-md'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}>
                        <div className='h-32 w-32 rounded-lg bg-primary-bg/50 p-2 flex-shrink-0'>
                          <img
                            src={
                              item.product?.images?.[0] || '/placeholder.svg'
                            }
                            alt={item.product?.name}
                            className='h-full w-full object-cover rounded-md'
                          />
                        </div>
                        <div className='flex flex-1 flex-col justify-between'>
                          <div>
                            <h3 className='text-xl font-semibold text-primary-text mb-2'>
                              {item.product?.name}
                            </h3>
                            <p className='text-sm text-secondary-text mb-4'>
                              {item.product?.platform}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3 '>
                              <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8 rounded-full border-none'
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.product._id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}>
                                <Minus className='h-4 w-4' />
                              </Button>
                              <span className='w-8 text-center text-white text-lg font-medium'>
                                {item.quantity}
                              </span>
                              <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8 rounded-full border-none'
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.product._id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={item.quantity >= 5}>
                                <Plus className='h-4 w-4' />
                              </Button>
                            </div>
                            <p className='text-xl font-bold text-primary-text'>
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-red-500 hover:bg-red-500/20 self-start'
                          onClick={() => handleRemoveItem(item.product._id)}>
                          <X className='h-5 w-5' />
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className='flex flex-col items-center justify-center h-[50vh] text-secondary-text'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}>
                    <ShoppingCart className='h-16 w-16 mb-6 text-accent-blue' />
                    <p className='text-xl mb-4'>Your cart is empty</p>
                    <Button
                      variant='outline'
                      onClick={() => navigate('/')}
                      className='text-accent-blue border-accent-blue hover:bg-accent-blue hover:text-white'>
                      Start Shopping
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </div>

          {cartItems?.length > 0 && (
            <motion.div
              className='lg:col-span-1'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <div className='bg-secondary-bg p-6 rounded-lg shadow-md'>
                <h2 className='text-2xl font-bold mb-4 text-primary-text'>
                  Order Summary
                </h2>
                <Separator className='bg-primary-bg/20 mb-4' />
                <div className='space-y-2 mb-4'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-secondary-text'>Subtotal</span>
                    <span className='text-primary-text font-medium'>
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-secondary-text'>Shipping</span>
                    <span className='text-primary-text font-medium'>
                      Calculated at checkout
                    </span>
                  </div>
                </div>
                <Separator className='bg-primary-bg/20 mb-4' />
                <div className='flex justify-between items-center mb-6'>
                  <span className='text-lg font-semibold text-primary-text'>
                    Total
                  </span>
                  <span className='text-2xl font-bold text-primary-text'>
                    ₹{total.toFixed(2)}
                  </span>
                </div>
                <Button
                  className='w-full bg-accent-blue hover:bg-hover-blue text-white py-6 rounded-lg text-lg font-medium'
                  onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className='flex flex-col items-center justify-center h-[calc(100vh-200px)] text-primary-text rounded-lg shadow-md p-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <motion.div
            className='relative w-24 h-24 mb-8'
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}>
            <motion.div
              className='absolute inset-0 bg-accent-blue rounded-full opacity-20'
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <Lock className='w-full h-full text-accent-blue' />
          </motion.div>
          <motion.h2
            className='text-3xl font-bold mb-4 text-center'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            Your Cart is Locked
          </motion.h2>
          <motion.p
            className='text-secondary-text mb-8 text-center text-lg'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}>
            Log in to view your cart and start shopping
          </motion.p>
          <motion.button
            className='px-8 py-4 bg-accent-blue text-white rounded-lg font-medium text-lg hover:bg-hover-blue transition duration-300'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            Log In
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
