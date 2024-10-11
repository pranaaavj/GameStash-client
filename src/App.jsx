import routes from './routes/user.routes';
import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(routes);

const App = () => {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
};

export default App;
