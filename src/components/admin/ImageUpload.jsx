/* eslint-disable react/prop-types */
import { UploadWidget } from './UploadWidget';
import { Button } from '@/shadcn/components/ui/button';
import { X } from 'lucide-react';

export const ImageUploader = ({ images, setImages }) => {
  const handleSetImageUrl = (url) => {
    setImages((prev) => [...prev, url]);
  };

  const handleDeleteImage = (url) => {
    setImages((prev) => prev.filter((image) => image !== url));
  };

  return (
    <div>
      <UploadWidget onSetImageUrl={handleSetImageUrl} />

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
        {images?.length > 0 &&
          images.map((url, index) => (
            <div
              key={index}
              className='relative'>
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className='w-full h-40 object-cover rounded-lg'
              />
              <Button
                variant='outline'
                size='icon'
                type='button'
                className='absolute top-2 right-2'
                onClick={() => handleDeleteImage(url)}>
                <X className='h-4 w-4 text-red-600' />
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
};
