import PropTypes from 'prop-types';
import { useUsers } from '@/hooks';
import { Navigate, Outlet } from 'react-router-dom';

export const UnauthorizedRoute = () => {
  const user = useUsers();

  if (user && user?.token) return <Navigate to='/' />;

  return <Outlet />;
};

UnauthorizedRoute.propTypes = {
  children: PropTypes.any,
};
