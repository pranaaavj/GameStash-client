import {
  Alert as ShadAlert,
  AlertDescription,
} from '@/shadcn/components/ui/alert';
import PropTypes from 'prop-types';

export function Alert({ Icon, variant, description }) {
  return (
    <ShadAlert variant={variant}>
      <Icon />
      <AlertDescription className='ml-3'>{description}</AlertDescription>
    </ShadAlert>
  );
}

Alert.propTypes = {
  Icon: PropTypes.any,
  variant: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
