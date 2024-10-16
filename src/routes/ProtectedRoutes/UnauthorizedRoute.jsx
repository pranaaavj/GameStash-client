import PropTypes from 'prop-types';
import { useUsers } from '@/hooks/users/useUsers';
import { Navigate } from 'react-router-dom';

export const UnauthorizedRoute = ({ children }) => {
  const user = useUsers();

  if (user && user?.token) {
    return <Navigate to='/user/home' />;
  }

  return children;
};

UnauthorizedRoute.propTypes = {
  children: PropTypes.any,
};
