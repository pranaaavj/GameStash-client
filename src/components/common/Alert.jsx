import {
  Alert as ShadAlert,
  AlertDescription,
} from '@/shadcn/components/ui/alert';
import PropTypes from 'prop-types';

export function Alert({ Icon, variant, description }) {
  return (
    <ShadAlert
      variant={variant}
      className='flex items-center justify-start p-4 space-x-2 w-full font-sans my-5'>
      <div className='flex-shrink-0'>
        <Icon className='w-6 h-6 text-red-500' />
      </div>
      <AlertDescription className='ml-2 text-md font-bold'>
        {description}
      </AlertDescription>
    </ShadAlert>
  );
}

Alert.propTypes = {
  Icon: PropTypes.any,
  variant: PropTypes.string.isRequired,
  description: PropTypes.any.isRequired,
};
