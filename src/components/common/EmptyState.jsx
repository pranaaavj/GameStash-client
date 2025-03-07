/* eslint-disable react/prop-types */
import { FileQuestion } from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import { motion } from 'framer-motion';

export const EmptyState = ({
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  icon: Icon = FileQuestion,
  actionLabel,
  actionLink,
  onAction,
  iconSize = 64,
  className = '',
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
      },
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'reverse',
      },
    },
  };

  return (
    <motion.div
      className={`w-full flex flex-col items-center justify-center py-12 px-4 ${className}`}
      variants={containerVariants}
      initial='hidden'
      animate='visible'>
      <motion.div
        className='bg-secondary-bg/30 rounded-full p-6 mb-6 relative overflow-hidden'
        variants={iconVariants}
        animate={['visible', 'pulse']}>
        <motion.div
          className='absolute inset-0 bg-accent-blue/10 rounded-full'
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
          }}
        />
        <Icon
          size={iconSize}
          className='text-accent-blue opacity-70 relative z-10'
        />
      </motion.div>

      <motion.h3
        className='text-xl font-semibold text-primary-text mb-2'
        variants={itemVariants}>
        {title}
      </motion.h3>

      <motion.p
        className='text-secondary-text text-center max-w-md mb-6'
        variants={itemVariants}>
        {description}
      </motion.p>

      {actionLabel && (actionLink || onAction) && (
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onAction}
            className='bg-accent-blue hover:bg-accent-blue/90 text-primary-text transition-colors'
            {...(actionLink ? { as: 'a', href: actionLink } : {})}>
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
