/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveItemFromCartMutation,
} from '@/redux/api/user/cartApi';
import { ScrollArea } from '@/shadcn/components/ui/scroll-area';
import { Separator } from '@/shadcn/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shadcn/components/ui/sheet';
import { Button } from '@/shadcn/components/ui/button';
import { X, Plus, Minus, ShoppingCart, Lock } from 'lucide-react';
import { useUsers } from '@/hooks';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart({ isOpen, onClose }) {
  const user = useUsers();
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
    }

    if (quantity < 1) return;

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
      console.log(response);
      if (response?.success) {
        setCartItems(response.data.items);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  if (isCartError) {
    console.log();
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={onClose}
      aria-describedby='dialog-description'
      aria-labelledby='cart-title'
      className='text-primary-text'>
      <SheetContent
        className='w-full sm:max-w-lg bg-secondary-bg text-primary-text border-l border-none'
        aria-describedby='dialog-description'
        aria-labelledby='cart-title'>
        {user?.userInfo ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <p
              id='dialog-description'
              className='sr-only'>
              Review and manage items in your cart. You can update quantities,
              remove items, and proceed to checkout.
            </p>
            <SheetHeader className='space-y-2.5 pb-6 border-none text-primary-text'>
              <div className='flex items-center justify-between'>
                <SheetTitle className='text-2xl font-bold text-primary-text'>
                  My Cart
                </SheetTitle>
              </div>
            </SheetHeader>

            <ScrollArea className='flex-1 -mx-6 px-6 text-primary-text'>
              <AnimatePresence>
                {cartItems?.length > 0 ? (
                  <motion.div className='space-y-6'>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item._id}
                        className='flex gap-4'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}>
                        <div className='h-24 w-24 rounded-lg bg-primary-bg/50 p-2'>
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
                            <h3 className='font-medium text-primary-text'>
                              {item.product?.name}
                            </h3>
                            <p className='text-sm text-secondary-text'>
                              {item.product?.platform}
                            </p>
                          </div>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 pt-4'>
                              <motion.div whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-8 w-8 rounded-lg bg-primary-bg/50 border-none'
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.product._id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}>
                                  <Minus className='h-4 w-4' />
                                </Button>
                              </motion.div>
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className='w-8 text-center'>
                                {item.quantity}
                              </motion.span>
                              <motion.div whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-8 w-8 rounded-lg bg-primary-bg/50 border-none'
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.product._id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={item.quantity >= 5}>
                                  <Plus className='h-4 w-4' />
                                </Button>
                              </motion.div>
                            </div>
                            <motion.p
                              key={item.quantity}
                              initial={{ scale: 1.1 }}
                              animate={{ scale: 1 }}
                              className='font-medium text-primary-text'>
                              ₹{(item.product.price * item.quantity).toFixed(2)}{' '}
                              INR
                            </motion.p>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-red-500 hover:bg-red-500/20'
                            onClick={() => handleRemoveItem(item.product._id)}>
                            <X className='h-4 w-4' />
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className='flex flex-col items-center justify-center h-[50vh] text-secondary-text'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}>
                    <ShoppingCart className='h-12 w-12 mb-4' />
                    <p>Your cart is empty</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>

            {cartItems?.length > 0 && (
              <motion.div
                className='space-y-4 pt-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}>
                <Separator className='bg-primary-bg/20' />
                <div className='space-y-1.5'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-secondary-text'>Shipping</span>
                    <span className='text-secondary-text'>
                      Calculated at checkout
                    </span>
                  </div>
                  <div className='flex items-center justify-between pt-2'>
                    <span className='text-base font-medium text-primary-text'>
                      Total
                    </span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className='text-lg font-bold text-primary-text'>
                      ${total.toFixed(2)} INR
                    </motion.span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <Button
                    className='w-full bg-accent-blue hover:bg-hover-blue text-white py-6 rounded-lg text-lg font-medium'
                    onClick={() => console.log('Proceeding to checkout')}>
                    Proceed to Checkout
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className='flex flex-col items-center justify-center h-full bg-primary-bg text-primary-text'
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
              className='text-2xl font-bold mb-4 text-center'
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}>
              Your Cart is Locked
            </motion.h2>
            <motion.p
              className='text-secondary-text mb-8 text-center'
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}>
              Log in to view your cart and start shopping
            </motion.p>
            <motion.button
              className='px-6 py-3 bg-accent-red text-white rounded-md font-medium hover:bg-opacity-90 transition duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Log In
            </motion.button>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
}
