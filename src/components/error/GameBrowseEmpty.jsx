import { motion } from 'framer-motion';

export const GameBrowserEmpty = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className='col-span-full flex flex-col items-center justify-center py-10 px-4 text-center'>
    <div className='bg-secondary-bg/30 p-6 rounded-xl max-w-md'>
      <h3 className='text-xl font-bold mb-2'>No Games Found</h3>
      <p className='text-secondary-text'>
        We could not find any games matching your filters. Try adjusting your
        search criteria or clearing filters.
      </p>
    </div>
  </motion.div>
);
