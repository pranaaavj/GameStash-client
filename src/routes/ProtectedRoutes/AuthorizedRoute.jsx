import PropTypes from 'prop-types';
import { useUsers } from '@/hooks';
import { Navigate, Outlet } from 'react-router-dom';
import { Loading } from '@/components/error';

export const AuthorizedRoute = () => {
  const user = useUsers();

  if (!user) return <Loading />;

  if (!user?.token)
    return (
      <Navigate
        to='/auth/login'
        replace
      />
    );

  if (!user?.userInfo)
    // User logged out or blocked
    return (
      <Navigate
        to='/auth/blocked'
        replace
      />
    );

  return user?.userInfo?.role === 'user' || user?.userInfo?.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to='/auth/unauthorized' />
  );
};

AuthorizedRoute.propTypes = {
  children: PropTypes.any,
};
