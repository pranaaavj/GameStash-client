import { useNavigate, Link } from 'react-router-dom';
import { PageTransition } from '../common';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <main className='grid min-h-full place-items-center bg-primary-bg px-6 py-24 sm:py-32 lg:px-8 h-screen'>
        <div className='text-center text-primary-text'>
          <p className='text-base font-semibold text-primary-text'>404</p>
          <h1 className='mt-4 text-3xl font-bold tracking-tight text-primary-text sm:text-5xl'>
            Page not found
          </h1>
          <p className='mt-6 text-base leading-7 text-primary-text'>
            Sorry, we couldn&#39;t find the page you&#39;re looking for.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Link
              to='/'
              className='rounded-md bg-accent-red px-3.5 py-2.5 text-sm font-semibold text-primary-text shadow-sm hover:bg-hover-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
              Go home
            </Link>
            <Link
              onClick={() => navigate(-1)}
              className='rounded-md bg-accent-red px-3.5 py-2.5 text-sm font-semibold text-primary-text shadow-sm hover:bg-hover-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
              Go Back
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};
