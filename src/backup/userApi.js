// import { createApi } from '@reduxjs/toolkit/query/react';
// import { userBaseQueryWithReAuth } from './userBaseQuery';

// export const userApi = createApi({
//   reducerPath: 'userApi',
//   baseQuery: userBaseQueryWithReAuth,
//   tagTypes: ['Address', 'Cart'],
//   endpoints: (builder) => ({
//     // // Home
//     // getProducts: builder.query({
//     //   query: ({ page = 1, limit = 5, queryOptions = null }) => ({
//     //     url: '/user/products',
//     //     params: { page, limit, queryOptions },
//     //   }),
//     // }),
//     // getProductsByGenre: builder.query({
//     //   query: ({ page = 1, limit = 5, genre }) => ({
//     //     url: `/user/products/${genre}`,
//     //     params: { page, limit },
//     //   }),
//     // }),
//     // getProduct: builder.query({
//     //   query: (productId) => ({
//     //     url: `/user/product/${productId}`,
//     //   }),
//     // }),
//     // getReviewByProduct: builder.query({
//     //   query: (productId) => ({
//     //     url: `/user/review/${productId}`,
//     //   }),
//     // }),

//     // Profile
//     getProfileDetails: builder.query({
//       query: (userId) => ({
//         url: `/user/details/${userId}`,
//       }),
//     }),
//     editUserProfile: builder.mutation({
//       query: ({ userId, newUserInfo }) => ({
//         url: `/user/details/${userId}`,
//         method: 'PATCH',
//         body: newUserInfo,
//       }),
//     }),
//     changeUserPass: builder.mutation({
//       query: ({ userId, passData }) => ({
//         url: `/user/details/change-pass/${userId}`,
//         method: 'PATCH',
//         body: passData,
//       }),
//     }),
//     // Get all addresses of user
//     getAllAddresses: builder.query({
//       query: () => ({
//         url: '/user/address',
//       }),
//       providesTags: ['Address'],
//     }),

//     // Get a specific address by ID
//     getOneAddress: builder.query({
//       query: (addressId) => ({
//         url: `/user/address/${addressId}`,
//       }),
//       providesTags: ['Address'],
//     }),

//     // Add a new address
//     addAddress: builder.mutation({
//       query: (newAddress) => ({
//         url: '/user/address',
//         method: 'POST',
//         body: newAddress,
//       }),
//       invalidatesTags: ['Address'],
//     }),

//     // Update an address by ID
//     editAddress: builder.mutation({
//       query: ({ addressId, updatedAddress }) => ({
//         url: `/user/address/${addressId}`,
//         method: 'PATCH',
//         body: updatedAddress,
//       }),
//       invalidatesTags: ['Address'],
//     }),

//     // Delete an address by ID
//     deleteAddress: builder.mutation({
//       query: (addressId) => ({
//         url: `/user/address/${addressId}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Address'],
//     }),

//     // Get the cart for a specific user
//     getCart: builder.query({
//       query: () => '/user/cart',
//       providesTags: ['Cart'],
//     }),

//     // Add an item to the cart
//     addItemToCart: builder.mutation({
//       query: ({ productId, quantity }) => ({
//         url: '/user/cart',
//         method: 'POST',
//         body: { productId, quantity },
//       }),
//       invalidatesTags: ['Cart'],
//     }),

//     // Update the quantity of a specific item
//     updateCartItem: builder.mutation({
//       query: ({ productId, quantity }) => ({
//         url: '/user/cart',
//         method: 'PATCH',
//         body: { productId, quantity },
//       }),
//       invalidatesTags: ['Cart'],
//     }),

//     // Remove a specific item from the cart
//     removeItemFromCart: builder.mutation({
//       query: (productId) => ({
//         url: `/user/cart/${productId}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Cart'],
//     }),

//     // Clear the entire cart
//     clearCart: builder.mutation({
//       query: () => ({
//         url: '/user/cart',
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Cart'],
//     }),
//   }),
// });

// export const {
//   // User home
//   useGetProductQuery,
//   useGetProductsQuery,
//   useGetProductsByGenreQuery,
//   useGetReviewByProductQuery,
//   // User Profile
//   useGetProfileDetailsQuery,
//   useEditUserProfileMutation,
//   useChangeUserPassMutation,
//   // User address
//   useAddAddressMutation,
//   useDeleteAddressMutation,
//   useEditAddressMutation,
//   useGetAllAddressesQuery,
//   useGetOneAddressQuery,

//   // Cart
//   useGetCartQuery,
//   useAddItemToCartMutation,
//   useClearCartMutation,
//   useRemoveItemFromCartMutation,
//   useUpdateCartItemMutation,
// } = userApi;
