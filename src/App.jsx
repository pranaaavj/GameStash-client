import routes from './routes/user.routes';
import { store, Provider } from './redux/store';
import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(routes);

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
