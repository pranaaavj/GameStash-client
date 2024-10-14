import { authRoutes, adminRoutes } from './routes';
import { store, Provider } from './redux/store';
import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([...authRoutes, ...adminRoutes]);

const App = () => {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  );
};

export default App;
