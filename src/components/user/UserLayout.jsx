import { Loading } from '../error';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Outlet, useNavigation } from 'react-router-dom';
import { Footer, Navbar, ScrollToTop } from '../common';

export const UserLayout = () => {
  const navigation = useNavigation();

  return (
    <div className='flex flex-col min-h-screen '>
      <Navbar />
      <ScrollToTop />
      <div className='pt-16 px-4 sm:px-8 md:px-12 lg:px-20'>
        <Breadcrumbs />
      </div>
      {navigation.state === 'loading' && <Loading />}
      <main className='w-full max-w-[75rem] px-4 sm:px-6 md:px-8 mx-auto min-h-[calc(100vh-var(--navbar-height)-var(--breadcrumb-height))]'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
