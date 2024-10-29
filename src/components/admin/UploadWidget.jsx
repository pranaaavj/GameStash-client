/* eslint-disable react/prop-types */
import { Button } from '@/shadcn/components/ui/button';
import { Upload } from 'lucide-react';
import { useEffect, useRef } from 'react';

export const UploadWidget = ({ onSetImageUrl }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'dopbmvmkw',
        uploadPreset: 'product-images',
        cropping: true,
        sources: ['local', 'url'],
      },
      (err, res) => {
        if (!err && res && res.event === 'success') {
          console.log(res.info);
          onSetImageUrl(res.info.secure_url);
        }
      }
    );
  }, [onSetImageUrl]);

  return (
    <Button
      type='button'
      onClick={() => widgetRef.current.open()}>
      <Upload className='w-4 h-4 mr-2' />
      Upload Images
    </Button>
  );
};
