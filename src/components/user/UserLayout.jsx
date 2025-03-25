import { Loading } from '../error';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Outlet, useNavigation } from 'react-router-dom';
import { Footer, Navbar, ScrollToTop } from '../common';

export const UserLayout = () => {
  const navigation = useNavigation();

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <ScrollToTop />
      <div className='pt-16 px-4 sm:px-8 md:px-12 lg:px-20'>
        <Breadcrumbs />
      </div>
      {navigation.state === 'loading' && <Loading />}
      <main className='flex-grow mx-2 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-20 min-h-[calc(100vh-var(--navbar-height)-var(--breadcrumb-height))]'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
