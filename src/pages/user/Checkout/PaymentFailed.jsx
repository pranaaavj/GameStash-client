import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ShoppingBag,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import { Link } from 'react-router-dom';

export const PaymentFailedConfirmation = () => {
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => setShowActions(true), 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-primary-bg text-primary-text relative overflow-hidden'>
      <AnimatePresence>
        {!showActions && (
          <motion.div
            className='relative'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}>
            <motion.div
              className='w-32 h-32 rounded-full bg-amber-500 flex items-center justify-center shadow-xl'
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{
                times: [0, 0.6, 1],
                duration: 0.8,
                ease: 'easeInOut',
              }}>
              <AlertTriangle className='w-16 h-16 text-white' />
            </motion.div>
            <motion.div
              className='absolute -inset-4 rounded-full border-4 border-amber-500'
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 0.8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeOut',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.h2
        className='text-4xl font-bold mt-8 mb-2 text-white drop-shadow-lg'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}>
        Order Placed, Payment Failed
      </motion.h2>
      <motion.p
        className='text-lg text-white text-center max-w-md mb-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}>
        Your order has been successfully placed, but we couldnt process your
        payment.
      </motion.p>
      <motion.p
        className='text-md text-white text-opacity-80 text-center max-w-md mb-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}>
        Dont worry! You can retry the payment from your orders section.
      </motion.p>
      <motion.div
        className='text-center text-amber-300 text-opacity-90 mb-10 px-4 py-3 bg-amber-900 bg-opacity-30 rounded-lg'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}>
        <p>Your order will be processed once the payment is completed.</p>
      </motion.div>
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link to='/orders'>
                <Button className='bg-accent-blue hover:bg-hover-blue text-white shadow-lg flex items-center w-full sm:w-auto justify-center'>
                  <CreditCard className='mr-2 h-4 w-4' />
                  Retry Payment
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
              <Link to='/orders'>
                <Button
                  variant='outline'
                  className='border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white shadow-lg flex items-center w-full sm:w-auto justify-center'>
                  <ShoppingBag className='mr-2 h-4 w-4' />
                  View All Orders
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
