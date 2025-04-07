import { showToast } from '.';

export const requireLogin = (user, navigate, location) => {
  if (!user.userInfo) {
    showToast.error('Please login to continue.');

    navigate('/login', { state: { from: location.pathname } });
    return false;
  }

  return true;
};
