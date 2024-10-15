import { ChakraProvider } from '@chakra-ui/react';
import { store, Provider } from './redux/store';
import { authRoutes, adminRoutes } from './routes';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Toaster } from 'sonner';

const router = createBrowserRouter([...authRoutes, ...adminRoutes]);

const App = () => {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Toaster position='top-left' />
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  );
};

export default App;
