import PropTypes from 'prop-types';
import { useUsers } from '@/hooks/users/useUsers';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthorizedRoute = () => {
  const user = useUsers();

  if (!user) {
    return <h1>Loading...</h1>;
  }

  if (!user?.token) {
    return (
      <Navigate
        to='/auth/login'
        replace
      />
    );
  }

  if (user?.authStatus === 'blocked') {
    return (
      <Navigate
        to='/auth/blocked'
        replace
      />
    );
  }

  if (user?.userInfo?.role === 'user' || user?.userInfo?.role === 'admin') {
    return <Outlet />;
  }

  return <Navigate to='/auth/unauthorized' />;
};

AuthorizedRoute.propTypes = {
  children: PropTypes.any,
};
