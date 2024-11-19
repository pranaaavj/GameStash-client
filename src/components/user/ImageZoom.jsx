/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ImageZoom = ({ src, alt = '' }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const zoomDelay = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Ensure the position stays within bounds [0, 100] for smooth edge behavior
    setZoomPosition({
      x: Math.max(0, Math.min(x, 100)),
      y: Math.max(0, Math.min(y, 100)),
    });
  };

  const handleMouseEnter = () => {
    zoomDelay.current = setTimeout(() => {
      setIsZoomed(true);
    }, 800);
  };

  const handleMouseLeave = () => {
    if (zoomDelay.current) {
      clearTimeout(zoomDelay.current);
    }
    setIsZoomed(false);
  };

  useEffect(() => {
    return () => {
      if (zoomDelay.current) {
        clearTimeout(zoomDelay.current);
      }
    };
  }, []);

  return (
    <div className='relative w-full h-full'>
      <div
        ref={imageRef}
        className='w-full h-full overflow-hidden bg-primary-bg'
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <img
          src={src}
          alt={alt}
          className='w-full h-full object-contain'
        />
      </div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed top-0 right-0 w-1/2 h-screen bg-primary-bg shadow-xl overflow-hidden z-50'>
            <div
              className='absolute w-[200%] h-[200%]'
              style={{
                transform: `translate(-${zoomPosition.x}%, -${zoomPosition.y}%)`,
                backgroundImage: `url(${src})`,
                backgroundSize: '200%',
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
