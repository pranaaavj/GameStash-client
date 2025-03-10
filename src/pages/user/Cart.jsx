'use client';

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
    {
      skip: !user?.userInfo?.id,
    }
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
    <div className='container mx-auto px-4 py-10 max-w-6xl'>
      <h1 className='text-3xl md:text-4xl font-bold mb-10 text-primary-text'>
        Your Cart
      </h1>
      {user?.userInfo ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {cartItems?.length > 0 ? (
            <>
              <div className='lg:col-span-2'>
                <ScrollArea className='h-[calc(100vh-250px)] pr-4'>
                  <AnimatePresence initial={false}>
                    <motion.div className='space-y-6'>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item._id}
                          className='flex gap-6 bg-secondary-bg p-5 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-secondary-bg/80'
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}>
                          <div className='h-28 w-28 md:h-32 md:w-32 rounded-lg bg-primary-bg/50 p-2 flex-shrink-0 overflow-hidden'>
                            <img
                              src={
                                item.product?.images?.[0] || '/placeholder.svg'
                              }
                              alt={item.product?.name}
                              className='h-full w-full object-cover rounded-md transition-transform duration-300 hover:scale-105'
                            />
                          </div>
                          <div className='flex flex-1 flex-col justify-between'>
                            <div>
                              <h3 className='text-lg md:text-xl font-semibold text-primary-text mb-1'>
                                {item.product?.name}
                              </h3>
                              <p className='text-sm text-secondary-text mb-4'>
                                {item.product?.platform}
                              </p>
                              {item.product.stock < 10 && (
                                <span className='text-xs px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded-full ml-2'>
                                  Only {item.product.stock} left
                                </span>
                              )}
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-2 md:gap-3'>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-8 w-8 rounded-full border hover:bg-accent-red hover:border-accent-red transition-colors'
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.product._id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}>
                                  <Minus className='h-3 w-3 md:h-4 md:w-4' />
                                </Button>
                                <span className='w-8 text-center text-white text-lg font-medium'>
                                  {item.quantity}
                                </span>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-8 w-8 rounded-full border hover:bg-accent-red hover:border-accent-red transition-colors'
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.product._id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={item.quantity >= 5}>
                                  <Plus className='h-3 w-3 md:h-4 md:w-4' />
                                </Button>
                              </div>
                              <p className='text-xl font-bold text-primary-text'>
                                ₹
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-red-500/70 hover:text-red-500 hover:bg-red-500/10 self-start -mt-1 -mr-2 transition-colors'
                            onClick={() => handleRemoveItem(item.product._id)}>
                            <X className='h-5 w-5' />
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </ScrollArea>
              </div>
              <motion.div
                className='lg:col-span-1'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <div className='bg-secondary-bg p-6 md:p-8 rounded-xl shadow-sm sticky top-6'>
                  <h2 className='text-xl md:text-2xl font-bold mb-5 text-primary-text'>
                    Order Summary
                  </h2>
                  <Separator className='bg-primary-bg/20 mb-5' />
                  <div className='space-y-4 mb-5'>
                    <div className='flex justify-between text-sm md:text-base'>
                      <span className='text-secondary-text'>Subtotal</span>
                      <span className='text-primary-text font-medium'>
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm md:text-base'>
                      <span className='text-secondary-text'>Shipping</span>
                      <span className='text-primary-text font-medium'>
                        Calculated at checkout
                      </span>
                    </div>
                  </div>
                  <Separator className='bg-primary-bg/20 mb-5' />
                  <div className='flex justify-between items-center mb-8'>
                    <span className='text-lg font-semibold text-primary-text'>
                      Total
                    </span>
                    <span className='text-2xl font-bold text-primary-text'>
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    className='w-full bg-accent-blue hover:bg-hover-blue text-white py-6 rounded-lg text-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md'
                    onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </div>
              </motion.div>
            </>
          ) : (
            <div className='lg:col-span-3 flex justify-center'>
              <motion.div
                className='flex flex-col items-center justify-center h-[50vh] text-secondary-text max-w-md w-full'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <ShoppingCart className='h-16 w-16 mb-6 text-accent-blue opacity-80' />
                <p className='text-xl mb-6 font-medium'>Your cart is empty</p>
                <Button
                  variant='outline'
                  onClick={() => navigate('/')}
                  className='text-accent-blue border-accent-blue hover:bg-accent-blue hover:text-white px-6 py-5 font-medium transition-all duration-300'>
                  Start Shopping
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className='flex flex-col items-center justify-center h-[calc(100vh-200px)] text-primary-text rounded-xl shadow-sm p-8 bg-secondary-bg/50'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <motion.div
            className='relative w-20 h-20 md:w-24 md:h-24 mb-8'
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}>
            <motion.div
              className='absolute inset-0 bg-accent-blue rounded-full opacity-20'
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
            <Lock className='w-full h-full text-accent-blue' />
          </motion.div>
          <motion.h2
            className='text-2xl md:text-3xl font-bold mb-4 text-center'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            Your Cart is Locked
          </motion.h2>
          <motion.p
            className='text-secondary-text mb-8 text-center text-base md:text-lg max-w-md'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}>
            Log in to view your cart and start shopping
          </motion.p>
          <motion.button
            className='px-8 py-4 bg-accent-blue text-white rounded-lg font-medium text-lg hover:bg-hover-blue transition duration-300 shadow-sm hover:shadow-md'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            Log In
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
