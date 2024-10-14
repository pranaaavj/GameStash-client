import { Navbar } from '../common';
import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};
