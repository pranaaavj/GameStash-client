import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shadcn/components/ui/alert-dialog';
import PropTypes from 'prop-types';
import { Button } from '@/shadcn/components/ui/button';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={onClose}>
      <AlertDialogContent className='bg-secondary-bg text-primary-text rounded-md border-none'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-xl font-bold text-red-500'>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className='text-primary-text mt-2'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              variant='outline'
              onClick={onClose}
              className='bg-primary-bg text-primary-text border rounded-md px-4 py-2'>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant='destructive'
              onClick={onConfirm}
              className='bg-red-600 text-primary-text hover:bg-red-700 rounded-md px-4 py-2'>
              Confirm
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
