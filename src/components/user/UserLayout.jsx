import { Loading } from '../error';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Outlet, useNavigation } from 'react-router-dom';
import { Footer, Navbar, ScrollToTop } from '../common';

export const UserLayout = () => {
  const navigation = useNavigation();

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='pt-16 pl-20'>
        <Breadcrumbs />
      </div>
      {navigation.state === 'loading' && <Loading />}
      <ScrollToTop />
      <main className='flex-grow mx-20'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
