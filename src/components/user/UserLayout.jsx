import { Navbar } from '../common';
import { Outlet } from 'react-router-dom';

export const UserLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};
