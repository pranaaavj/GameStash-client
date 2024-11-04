/* eslint-disable react/prop-types */
import { Button } from '@/shadcn/components/ui/button';
import { Upload } from 'lucide-react';
import { useEffect, useRef } from 'react';

export const UploadWidget = ({ onSetImageUrls }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'dopbmvmkw',
        uploadPreset: 'product-images',
        cropping: true, // Disable cropping for multi-select
        multiple: false, // Enables multi-select functionality
        sources: ['local', 'url'], // Allow local files and URLs
        showPoweredBy: false,
        theme: 'minimal',
        styles: {
          palette: {
            window: '#333333',
            sourceBg: '#333333',
            windowBorder: '#1A1A1A',
            tabIcon: '#FFFFFF',
            inactiveTabIcon: '#CCCCCC',
            menuIcons: '#FFFFFF',
            link: '#9e9e9e',
            action: '#FF5722',
            inProgress: '#FF5722',
            complete: '#4CAF50',
            error: '#f44336',
            textDark: '#FFFFFF',
            textLight: '#EEEEEE',
          },
          fonts: {
            "'Poppins', sans-serif": {
              url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap',
              active: true,
            },
          },
        },
      },
      (err, res) => {
        if (!err && res && res.event === 'queues-end') {
          // Collect all uploaded URLs once the queue ends
          const uploadedUrls = res.info.files.map(
            (file) => file.uploadInfo.secure_url
          );
          onSetImageUrls(uploadedUrls);
        }
      }
    );
  }, [onSetImageUrls]);

  return (
    <Button
      type='button'
      onClick={() => widgetRef.current.open()}
      className='flex items-center bg-accent-red hover:bg-hover-red text-white font-medium py-2 px-4 rounded-md'>
      <Upload className='w-4 h-4 mr-2' />
      Upload Images
    </Button>
  );
};
