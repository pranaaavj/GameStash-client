import { Navbar } from '../common';
import { Outlet } from 'react-router-dom';

export const UserLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow'>
        <Outlet />
      </main>
    </div>
  );
};
