import { AdminLayout } from '@/components/admin';
import {
  Dashboard,
  AdminLogin,
  AddProduct,
  EditProduct,
  ProductList,
} from '@/pages/admin';

export const adminRoutes = [
  {
    path: 'admin/login',
    element: <AdminLogin />,
  },
  {
    path: 'admin',
    element: <AdminLayout />,
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
