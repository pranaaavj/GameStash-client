/* eslint-disable react/prop-types */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shadcn/lib/utils';
import { ImageZoom } from '../user/ImageZoom';

export function ImageGallery({ images = [], alt = 'Product image' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className='flex gap-4 w-full max-w-4xl mx-auto'>
      {/* Thumbnail Strip */}
      <div className='flex flex-col gap-2 py-2 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-thumb-rounded-md'>
        {images.map((image, index) => (
          <motion.button
            key={image}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              'relative w-20 h-20 rounded-lg overflow-hidden border-2',
              selectedIndex === index
                ? 'border-accent-red shadow-lg'
                : 'border-transparent hover:border-accent-red/50'
            )}
            whileTap={{ scale: 0.95 }}>
            <img
              src={image}
              alt={`${alt} ${index + 1}`}
              className='w-full h-full object-cover'
              loading='lazy'
            />
          </motion.button>
        ))}
      </div>

      {/* Main Image Display */}
      <div className='relative flex-1 aspect-square rounded-xl overflow-hidden bg-secondary-bg'>
        <ImageZoom
          src={images[selectedIndex]}
          alt={`${alt} ${selectedIndex + 1}`}
        />
      </div>

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className='group'>
              <motion.div
                className={cn(
                  'w-3 h-3 rounded-full transition-colors',
                  selectedIndex === index
                    ? 'bg-accent-red scale-125'
                    : 'bg-gray-400/50 group-hover:bg-gray-400'
                )}
                initial={false}
                animate={{
                  scale: selectedIndex === index ? 1.4 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
