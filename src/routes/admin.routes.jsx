import {
  Dashboard,
  AdminLogin,
  AddProduct,
  EditProduct,
  ProductList,
  BrandList,
  AddBrand,
  EditBrand,
  GenreList,
  AddGenre,
  EditGenre,
  UsersList,
  OrderList,
  OfferList,
  AddOffer,
  EditOffer,
  CouponList,
  EditCoupon,
  AddCoupon,
  Sales,
} from '@/pages/admin';
import { AdminError } from '@/components/error';
import { AdminLayout } from '@/components/admin';
import { AuthorizeAdminRoute } from './ProtectedRoutes';

export const adminRoutes = [
  {
    path: 'admin/login',
    element: <AdminLogin />,
    errorElement: <AdminError />,
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    errorElement: <AdminError />,
    children: [
      {
        path: '',
        element: <AuthorizeAdminRoute />,
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
          {
            path: 'brands',
            children: [
              {
                index: true,
                element: <BrandList />,
              },
              {
                path: 'add',
                element: <AddBrand />,
              },
              {
                path: 'edit/:brandId',
                element: <EditBrand />,
              },
            ],
          },
          {
            path: 'genres',
            children: [
              {
                index: true,
                element: <GenreList />,
              },
              {
                path: 'add',
                element: <AddGenre />,
              },
              {
                path: 'edit/:genreId',
                element: <EditGenre />,
              },
            ],
          },
          {
            path: 'orders',
            children: [
              {
                index: true,
                element: <OrderList />,
              },
            ],
          },
          {
            path: 'offers',
            children: [
              {
                index: true,
                element: <OfferList />,
              },
              {
                path: 'add',
                element: <AddOffer />,
              },
              {
                path: 'edit/:offerId',
                element: <EditOffer />,
              },
            ],
          },
          {
            path: 'coupons',
            children: [
              {
                index: true,
                element: <CouponList />,
              },
              {
                path: 'add',
                element: <AddCoupon />,
              },
              {
                path: 'edit/:couponId',
                element: <EditCoupon />,
              },
            ],
          },
          {
            path: 'users',
            element: <UsersList />,
          },
          {
            path: 'sales',
            element: <Sales />,
          },
        ],
      },
    ],
  },
];
