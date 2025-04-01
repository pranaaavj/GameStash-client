import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';

export const GameBrowserError = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className='col-span-full flex flex-col items-center justify-center py-10 px-4 text-center'>
    <AlertCircle className='h-12 w-12 text-accent-red mb-4' />
    <h3 className='text-xl font-bold mb-2'>Oops! Something went wrong</h3>
    <p className='text-secondary-text mb-6 max-w-md'>
      {message || "We couldn't load the games. Please try again."}
    </p>
    <Button
      onClick={onRetry}
      className='bg-accent-blue hover:bg-hover-blue text-white'>
      <RefreshCw className='h-4 w-4 mr-2' />
      Try Again
    </Button>
  </motion.div>
);
