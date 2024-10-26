import {
  Dashboard,
  AdminLogin,
  AddProduct,
  EditProduct,
  ProductList,
} from '@/pages/admin';
import { AdminError } from '@/pages/error';
import { AdminLayout } from '@/components/admin';

export const adminRoutes = [
  {
    path: 'admin/login',
    element: <AdminLogin />,
    errorElement: <AdminError />,
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    // errorElement: <AdminError />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <ProductList />,
          },
          {
            path: 'add',
            element: <AddProduct />,
          },
          {
            path: 'edit/:productId',
            element: <EditProduct />,
          },
        ],
      },
    ],
  },
];
