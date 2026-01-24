'use client';

import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

export const ContainerLoading = ({ size = 60, className = '' }) => {
  return (
    <div
      className={`flex items-center justify-center w-full h-full min-h-[100px] ${className}`}>
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 2,
            ease: 'linear',
            repeat: Number.POSITIVE_INFINITY,
          },
          scale: {
            duration: 1,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
          },
        }}
        className='text-accent-red'>
        <Gamepad2 size={size} />
      </motion.div>
    </div>
  );
};
