import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 z-50 flex min-h-screen items-center justify-center bg-primary-bg'>
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 2,
            ease: 'linear',
            repeat: Infinity,
          },
          scale: {
            duration: 1,
            ease: 'easeInOut',
            repeat: Infinity,
          },
        }}
        className='text-accent-red'>
        <Gamepad2 size={64} />
      </motion.div>
    </div>
  );
}
