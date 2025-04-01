import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag, Gift } from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import { Link } from 'react-router-dom';

export const OrderConfirmation = () => {
  const [showViewOrders, setShowViewOrders] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => setShowViewOrders(true), 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-primary-bg text-primary-text relative overflow-hidden'>
      <AnimatePresence>
        {!showViewOrders && (
          <motion.div
            className='relative'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}>
            <motion.div
              className='w-32 h-32 rounded-full bg-accent-red flex items-center justify-center shadow-xl'
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{
                times: [0, 0.6, 1],
                duration: 0.8,
                ease: 'easeInOut',
              }}>
              <Check className='w-16 h-16 text-white' />
            </motion.div>
            <motion.div
              className='absolute -inset-4 rounded-full border-4 border-accent-red'
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.h2
        className='text-4xl font-bold mt-8 mb-2 text-white drop-shadow-lg'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}>
        Order Confirmed!
      </motion.h2>
      <motion.p
        className='text-lg text-white text-center max-w-md mb-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}>
        Great news! Your gaming adventure awaits. We’re getting your order ready
        for delivery.
      </motion.p>
      <motion.div
        className='text-center text-white text-opacity-80 mb-10'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}>
        <p className='animate-pulse'>Preparing... Packing... Shipping Soon!</p>
      </motion.div>
      <AnimatePresence>
        {showViewOrders && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}>
            <div className='flex gap-4'>
              <Link to='/orders'>
                <Button className='bg-accent-blue hover:bg-hover-blue text-white shadow-lg flex items-center'>
                  <ShoppingBag className='mr-2 h-4 w-4' />
                  View All Orders
                </Button>
              </Link>
              <Link to='/shop'>
                <Button className='bg-accent-red hover:bg-hover-red text-white shadow-lg flex items-center'>
                  <Gift className='mr-2 h-4 w-4' />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
