import { showToast } from './showToast';

export const handleApiError = (
  err,
  fallbackMessage = 'Something went wrong! Please try again later'
) => {
  const message = err?.data?.message || fallbackMessage;
  showToast.error(message);
};
