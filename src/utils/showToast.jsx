import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const showToast = {
  success: (message, options = {}) =>
    toast.success(message, {
      duration: 2500,
      style: {
        borderLeft: '4px solid #4ade80',
      },
      icon: <CheckCircle className='h-5 w-5 text-[#4ade80]' />,
      ...options,
    }),

  error: (message, options = {}) =>
    toast.error(message, {
      duration: 3000,
      style: {
        borderLeft: '4px solid #e31c25',
      },
      icon: <AlertCircle className='h-5 w-5 text-[#e31c25]' />,
      ...options,
    }),

  info: (message, options = {}) =>
    toast(message, {
      duration: 2000,
      style: {
        borderLeft: '4px solid #66c0f4',
      },
      icon: <Info className='h-5 w-5 text-[#66c0f4]' />,
      ...options,
    }),
};
