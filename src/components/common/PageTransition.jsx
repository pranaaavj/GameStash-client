import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      layout='position'
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
      }}
      exit={{
        opacity: 0,
        scale: 1.02,
        filter: 'blur(4px)',
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}>
      {children}
    </motion.div>
  );
};

// Login Transition for future use if needed
// initial={{ opacity: 0, y: 10 }}
// animate={{ opacity: 1, y: 0 }}
// transition={{ duration: 0.2 }}
