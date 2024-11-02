import { useUsers } from '@/hooks/users/useUsers';
import { Outlet, Navigate } from 'react-router-dom';

export const AuthorizeAdminRoute = () => {
  const user = useUsers();

  if (!user) {
    return <h1>Loading...</h1>;
  }

  if (!user?.token) {
    return (
      <Navigate
        to='/admin/login'
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

  if (user?.userInfo?.role === 'admin') {
    return <Outlet />;
  }

  return <Navigate to='/auth/unauthorized' />;
};
