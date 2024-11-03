import { Loading } from '@/components/error';
import { useAdmins } from '@/hooks';
import { Outlet, Navigate } from 'react-router-dom';

export const AuthorizeAdminRoute = () => {
  const admin = useAdmins();
  console.log(admin);
  if (!admin) return <Loading />;

  if (!admin?.token)
    return (
      <Navigate
        to='/admin/login'
        replace
      />
    );

  if (admin?.adminInfo?.role === 'admin') return <Outlet />;

  return <Navigate to='/auth/unauthorized' />;
};
