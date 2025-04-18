import { ChakraProvider } from '@chakra-ui/react';
import { store, Provider } from './redux/store';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { authRoutes, adminRoutes, userRoutes } from './routes';
import { Toaster } from 'sonner';

const router = createBrowserRouter([
  ...authRoutes,
  ...adminRoutes,
  ...userRoutes,
]);

const App = () => {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Toaster
          position='top-center'
          theme='dark'
          expand
          toastOptions={{
            className: 'font-sans border-none rounded-lg shadow-xl',
            style: {
              background: '#1a1a1a',
              color: 'white',
            },
          }}
        />
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  );
};

export default App;
