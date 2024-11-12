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
        <Toaster position='top-center' />
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  );
};

export default App;
