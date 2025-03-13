/* eslint-disable react/prop-types */
import { UploadWidget } from './UploadWidget';
import { Button } from '@/shadcn/components/ui/button';
import { X } from 'lucide-react';
console.log('hi');
export const ImageUploader = ({ images, setImages }) => {
  // Update handleSetImageUrls to handle an array of URLs for multiple images
  const handleSetImageUrls = (urls) => {
    setImages((prev) => [...prev, ...urls]);
  };

  const handleDeleteImage = (url) => {
    setImages((prev) => prev.filter((image) => image !== url));
  };

  return (
    <div>
      {/* Pass the multi-image handler to UploadWidget */}
      <UploadWidget onSetImageUrls={handleSetImageUrls} />

      {/* Display uploaded images in a responsive grid */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
        {images?.length > 0 &&
          images.map((url, index) => (
            <div
              key={index}
              className='relative group'>
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className='w-full h-40 object-cover rounded-lg transition-opacity duration-300 group-hover:opacity-90'
              />
              <Button
                variant='outline'
                size='icon'
                type='button'
                className='absolute top-2 right-2 bg-secondary-bg hover:bg-primary-bg p-1 rounded-full shadow-md'
                onClick={() => handleDeleteImage(url)}>
                <X className='h-4 w-4 text-red-600' />
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
};
