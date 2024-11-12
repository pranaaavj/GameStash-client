import { toast } from 'sonner';

export const requireLogin = (user, navigate, location) => {
  if (!user.userInfo) {
    toast.error('Please login to continue.');

    navigate('/auth/login', { state: { from: location.pathname } });
    return false;
  }

  return true;
};
