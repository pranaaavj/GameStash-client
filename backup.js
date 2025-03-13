// // import {
// //   useGetProductQuery,
// //   useGetReviewByProductQuery,
// //   useGetProductsByGenreQuery,
// // } from '@/redux/api/user/productApi';
// // import { Button } from '@/shadcn/components/ui/button';
// // import { Reviews } from '../../../components/user/Reviews';
// // import { useEffect, useState } from 'react';
// // import { useParams, useNavigate, useLocation } from 'react-router-dom';
// // import { RelatedGamesFallback } from '@/components/error/RelatedFallback';
// // import {
// //   ShoppingCart,
// //   Heart,
// //   Minus,
// //   Plus,
// //   AlertCircle,
// //   PenLine,
// // } from 'lucide-react';
// // import { GameListing } from '..';
// // import { SystemRequirements, StarRating } from '@/components/user';
// // import {
// //   useAddItemToCartMutation,
// //   useGetCartQuery,
// // } from '@/redux/api/user/cartApi';
// // import { toast } from 'sonner';
// // import { useUsers } from '@/hooks';
// // import { requireLogin } from '@/utils';
// // import { ImageGallery } from '@/components/common/ImageGallery';
// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipProvider,
// //   TooltipTrigger,
// // } from '@/shadcn/components/ui/tooltip';
// // import { Badge } from '@/shadcn/components/ui/badge';
// // import { Pagination } from '@/shadcn/components/ui/pagination';

// // export function GameDetails() {
// //   const user = useUsers();
// //   const { productId } = useParams();
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const { data: cartData } = useGetCartQuery(user?.userInfo?.id, {
// //     skip: !user?.userInfo?.id,
// //   });

// //   const [quantity, setQuantity] = useState(1);
// //   const [isOutOfStock, setIsOutOfStock] = useState(false);
// //   const [pageState, setPageState] = useState({
// //     relatedGames: 1,
// //     reviews: 1,
// //   });
// //   const [reviewsPerPage] = useState(5);

// //   const {
// //     data: responseProducts,
// //     isError: isProductsError,
// //     error: productsError,
// //     isSuccess: isProductsSuccess,
// //   } = useGetProductQuery(productId);

// //   console.log(responseProducts);

// //   const { data: responseRelated, isSuccess: isRelatedProductSuccess } =
// //     useGetProductsByGenreQuery(
// //       {
// //         page: pageState.relatedGames,
// //         limit: 5,
// //         genre: responseProducts?.data?.genre?.name,
// //       },
// //       { skip: !responseProducts?.data?.genre?.name }
// //     );

// //   useEffect(() => {
// //     setQuantity(1);
// //   }, [productId]);

// //   useEffect(() => {
// //     if (cartData?.data?.items.length > 0) {
// //       const item = cartData.data.items.find(
// //         (item) => item?.product?._id === productId
// //       );
// //       const stockLeft = responseProducts?.data?.stock - (item?.quantity || 0);
// //       setIsOutOfStock(stockLeft <= 0);
// //     }
// //   }, [cartData, responseProducts, productId]);

// //   const {
// //     data: responseReviews,
// //     isProductsError: isReviewError,
// //     productsError: reviewError,
// //   } = useGetReviewByProductQuery(productId);

// //   const [addItemToCart, { isError: isAddCartError, error: addCartError }] =
// //     useAddItemToCartMutation();

// //   const filteredRelatedProducts =
// //     isRelatedProductSuccess &&
// //     responseRelated?.data?.products?.filter(
// //       (product) => product._id !== productId
// //     );

// //   const handleAddToCart = async () => {
// //     if (!requireLogin(user, navigate, location)) return;

// //     const item = cartData?.data?.items.find(
// //       (item) => item.product._id === productId
// //     );

// //     if (item?.quantity + quantity > 5) {
// //       toast.error('Maximum quantity added.');
// //       return;
// //     }

// //     if (responseProducts?.data?.stock <= item?.quantity) {
// //       setIsOutOfStock(true);
// //       return;
// //     }

// //     try {
// //       const response = await addItemToCart({ productId, quantity }).unwrap();
// //       if (response.success) {
// //         toast.success('Added to cart successfully!');

// //         const updatedStock = responseProducts?.data?.stock - quantity;

// //         if (updatedStock <= 0) {
// //           setIsOutOfStock(true);
// //         }
// //       }
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   const calculateDiscount = () => {
// //     if (!responseProducts?.data?.discountedPrice) return null;

// //     const originalPrice = responseProducts.data.price;
// //     const discountedPrice = responseProducts.data.discountedPrice;

// //     if (discountedPrice >= originalPrice) return null;

// //     const difference = originalPrice - discountedPrice;
// //     const percentOff = Math.round((difference / originalPrice) * 100);

// //     if (responseProducts.data.bestOffer.discountType === 'percentage') {
// //       return `${percentOff}% OFF`;
// //     } else {
// //       return `₹${difference.toFixed(0)} OFF`;
// //     }
// //   };

// //   const discount = calculateDiscount();

// //   const paginatedReviews = responseReviews?.data
// //     ? responseReviews.data.slice(
// //         (pageState.reviews - 1) * reviewsPerPage,
// //         pageState.reviews * reviewsPerPage
// //       )
// //     : [];

// //   const totalReviewPages = responseReviews?.data
// //     ? Math.ceil(responseReviews.data.length / reviewsPerPage)
// //     : 0;

// //   if (isReviewError) {
// //     console.log(reviewError);
// //   }

// //   if (isProductsError) {
// //     console.log(productsError);
// //   }

// //   if (isAddCartError) {
// //     console.log(addCartError);
// //   }

// //   return (
// //     isProductsSuccess && (
// //       <div className='min-h-screen bg-primary-bg text-primary-text font-sans px-4 sm:px-8 lg:px-16 select-none'>
// //         <div className='container mx-auto py-8'>
// //           <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
// //             {/* Left Column - Carousel */}
// //             <div className='space-y-6'>
// //               <div>
// //                 <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-3'>
// //                   {responseProducts?.data?.name}
// //                 </h1>
// //                 <div className='my-5 flex items-center'>
// //                   <StarRating rating={responseProducts?.data?.averageRating} />
// //                   <span className='ml-2 text-secondary-text'>
// //                     ({responseProducts?.data?.reviewCount} reviews)
// //                   </span>
// //                   {responseProducts?.data?.averageRating > 0 && (
// //                     <span className='ml-3 font-bold text-accent-green'>
// //                       {responseProducts?.data?.averageRating.toFixed(1)}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>
// //               <div className='w-full lg:w-[110%] transition-all duration-300 hover:shadow-xl rounded-xl overflow-hidden'>
// //                 <ImageGallery
// //                   images={responseProducts?.data?.images || []}
// //                   alt={responseProducts?.data?.name}
// //                   className='fade-transition'
// //                 />
// //               </div>
// //             </div>

// //             {/* Right Column - Game Info and Action Buttons */}
// //             <div className='ml-0 md:ml-5 lg:ml-10 mt-6 lg:mt-16 space-y-6'>
// //               <div className='bg-secondary-bg/30 p-5 rounded-xl'>
// //                 <div className='flex items-baseline gap-3 mb-2'>
// //                   {responseProducts?.data?.discountedPrice > 0 ? (
// //                     <>
// //                       <span className='text-primary-text text-3xl font-bold text-accent-green'>
// //                         ₹{responseProducts.data.discountedPrice.toFixed(0)}
// //                       </span>
// //                       <span className='text-secondary-text text-xl line-through'>
// //                         ₹{responseProducts.data.price.toFixed(0)}
// //                       </span>
// //                       {discount && (
// //                         <Badge className='bg-accent-green text-black font-medium ml-2'>
// //                           {discount}
// //                         </Badge>
// //                       )}
// //                     </>
// //                   ) : (
// //                     <span className='text-primary-text text-3xl font-bold'>
// //                       ₹{responseProducts?.data?.price.toFixed(0)}
// //                     </span>
// //                   )}
// //                 </div>

// //                 {responseProducts?.data?.stock === 0 ? (
// //                   <div className='flex items-center mt-3'>
// //                     <AlertCircle className='w-4 h-4 text-accent-red mr-2' />
// //                     <p className='text-accent-red text-sm font-semibold'>
// //                       Out of Stock
// //                     </p>
// //                   </div>
// //                 ) : responseProducts?.data?.stock < 10 ? (
// //                   <div className='flex items-center mt-3'>
// //                     <AlertCircle className='w-4 h-4 text-hover-red mr-2' />
// //                     <p className='text-hover-red text-sm font-semibold'>
// //                       Hurry! Only {responseProducts?.data?.stock} units left in
// //                       stock!
// //                     </p>
// //                   </div>
// //                 ) : (
// //                   <p className='text-secondary-text text-sm mt-3'>
// //                     In Stock: {responseProducts?.data?.stock} units available
// //                   </p>
// //                 )}
// //               </div>

// //               <div className='flex items-center space-x-4'>
// //                 <span className='text-lg font-semibold'>Quantity:</span>
// //                 <div className='flex items-center'>
// //                   <TooltipProvider>
// //                     <Tooltip>
// //                       <TooltipTrigger asChild>
// //                         <Button
// //                           variant='outline'
// //                           size='icon'
// //                           className='h-8 w-8 rounded-full border border-primary-bg/30 bg-primary-bg/5 hover:bg-accent-blue/20 hover:border-accent-blue/50 transition-colors'
// //                           onClick={() => setQuantity(Math.max(1, quantity - 1))}
// //                           disabled={quantity <= 1}>
// //                           <Minus className='h-3 w-3 md:h-4 md:w-4' />
// //                         </Button>
// //                       </TooltipTrigger>
// //                       {quantity <= 1 && (
// //                         <TooltipContent>
// //                           <p>Minimum quantity is 1</p>
// //                         </TooltipContent>
// //                       )}
// //                     </Tooltip>
// //                   </TooltipProvider>

// //                   {/* Fixed width for quantity display */}
// //                   <span className='mx-4 text-lg w-[2ch] text-center'>
// //                     {quantity}
// //                   </span>

// //                   <TooltipProvider>
// //                     <Tooltip>
// //                       <TooltipTrigger asChild>
// //                         <Button
// //                           variant='outline'
// //                           size='icon'
// //                           className='h-8 w-8 rounded-full border border-primary-bg/30 bg-primary-bg/5 hover:bg-accent-blue/20 hover:border-accent-blue/50 transition-colors'
// //                           onClick={() => setQuantity(quantity + 1)}
// //                           disabled={
// //                             quantity >= responseProducts?.data?.stock ||
// //                             quantity >= 5
// //                           }>
// //                           <Plus className='h-3 w-3 md:h-4 md:w-4' />
// //                         </Button>
// //                       </TooltipTrigger>
// //                       {quantity >= responseProducts?.data?.stock ? (
// //                         <TooltipContent>
// //                           <p>
// //                             Only {responseProducts?.data?.stock} units left!
// //                           </p>
// //                         </TooltipContent>
// //                       ) : quantity >= 5 ? (
// //                         <TooltipContent>
// //                           <p>Max limit per order reached</p>
// //                         </TooltipContent>
// //                       ) : null}
// //                     </Tooltip>
// //                   </TooltipProvider>
// //                 </div>
// //               </div>

// //               {/* Additional space for message to avoid layout shift */}
// //               <span className='text-red-500 text-sm mt-2 min-h-[1.5rem] block'>
// //                 {quantity >= responseProducts?.data?.stock
// //                   ? `Only ${responseProducts?.data?.stock} items are available in stock.`
// //                   : quantity >= 5
// //                   ? 'You can only order up to 5 items at a time.'
// //                   : ''}
// //               </span>

// //               <div className='space-y-3'>
// //                 <Button
// //                   className={`w-full font-semibold py-6 text-white transition-all duration-200 ${
// //                     responseProducts?.data?.stock >= 1 && !isOutOfStock
// //                       ? 'bg-accent-blue hover:bg-hover-blue'
// //                       : 'bg-gray-600 cursor-not-allowed'
// //                   }`}
// //                   disabled={isOutOfStock || responseProducts?.data?.stock < 1}>
// //                   {responseProducts?.data?.stock >= 1 && !isOutOfStock
// //                     ? 'Buy Now'
// //                     : 'No Stocks Left'}
// //                 </Button>

// //                 <Button
// //                   variant='secondary'
// //                   className='w-full bg-[#2A2A2A] hover:bg-[#353535] text-white py-5'
// //                   disabled={isOutOfStock || responseProducts?.data?.stock < 1}
// //                   onClick={handleAddToCart}>
// //                   <ShoppingCart className='w-4 h-4 mr-2' />
// //                   {responseProducts?.data?.stock >= 1 && !isOutOfStock
// //                     ? 'Add To Cart'
// //                     : 'No Stocks Left'}
// //                 </Button>

// //                 <Button
// //                   variant='secondary'
// //                   className='w-full bg-[#2A2A2A] hover:bg-[#353535] text-white py-5 hover:text-accent-blue transition-colors'
// //                   onClick={() => toast.info('Added to wishlist!')}>
// //                   <Heart className='w-4 h-4 mr-2' />
// //                   Add to Wishlist
// //                 </Button>
// //               </div>

// //               <div className='space-y-4 pt-4 border-t border-gray-800'>
// //                 <div className='grid grid-cols-2 gap-4'>
// //                   <div className='space-y-3'>
// //                     <div className='flex flex-col'>
// //                       <span className='text-secondary-text text-sm'>Brand</span>
// //                       <span className='font-medium text-primary-text'>
// //                         {responseProducts?.data?.brand.name}
// //                       </span>
// //                     </div>
// //                     <div className='flex flex-col'>
// //                       <span className='text-secondary-text text-sm'>
// //                         Platform
// //                       </span>
// //                       <span className='font-medium text-primary-text'>
// //                         {responseProducts?.data?.platform}
// //                       </span>
// //                     </div>
// //                   </div>
// //                   <div className='space-y-3'>
// //                     <div className='flex flex-col'>
// //                       <span className='text-secondary-text text-sm'>Genre</span>
// //                       <span className='font-medium text-primary-text'>
// //                         {responseProducts?.data?.genre.name}
// //                       </span>
// //                     </div>
// //                     <div className='flex flex-col'>
// //                       <span className='text-secondary-text text-sm'>
// //                         Release Date
// //                       </span>
// //                       <span className='font-medium text-primary-text'>
// //                         {new Date(
// //                           responseProducts?.data?.createdAt
// //                         ).toLocaleDateString()}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Bottom Section - Game Details, Description, System Requirements, Reviews */}
// //           <div className='mt-16 space-y-12'>
// //             <div className='bg-secondary-bg/20 p-6 rounded-xl'>
// //               <h2 className='text-2xl font-bold mb-4'>Description</h2>
// //               <p className='text-secondary-text leading-relaxed'>
// //                 {responseProducts?.data?.description}
// //               </p>
// //             </div>

// //             <div className='bg-secondary-bg/20 p-6 rounded-xl'>
// //               <h2 className='text-2xl font-bold mb-4'>System Requirements</h2>
// //               {responseProducts?.data?.systemRequirements ? (
// //                 <SystemRequirements
// //                   requirements={responseProducts?.data?.systemRequirements}
// //                 />
// //               ) : (
// //                 'No system requirements'
// //               )}
// //             </div>

// //             <div className='bg-secondary-bg/20 p-6 rounded-xl'>
// //               <div className='flex justify-between items-center mb-6'>
// //                 <div className='flex items-center gap-3'>
// //                   <h2 className='text-2xl font-bold'>Reviews</h2>
// //                   {responseProducts?.data?.averageRating > 0 && (
// //                     <div className='flex items-center bg-secondary-bg/50 px-3 py-1 rounded-lg'>
// //                       <StarRating
// //                         rating={responseProducts?.data?.averageRating}
// //                       />
// //                       <span className='ml-2 font-bold text-accent-green'>
// //                         {responseProducts?.data?.averageRating.toFixed(1)}
// //                       </span>
// //                     </div>
// //                   )}
// //                 </div>
// //                 <Button
// //                   className='bg-accent-blue hover:bg-hover-blue text-white'
// //                   onClick={() =>
// //                     toast.info('Write a review feature coming soon!')
// //                   }>
// //                   <PenLine className='w-4 h-4 mr-2' />
// //                   Write a Review
// //                 </Button>
// //               </div>

// //               {responseReviews?.data?.length > 0 ? (
// //                 <div className='space-y-6'>
// //                   <Reviews reviews={paginatedReviews} />

// //                   {totalReviewPages > 1 && (
// //                     <div className='flex justify-center mt-8'>
// //                       <Pagination>
// //                         <Button
// //                           variant='outline'
// //                           className='mr-2'
// //                           disabled={pageState.reviews === 1}
// //                           onClick={() =>
// //                             setPageState((prev) => ({
// //                               ...prev,
// //                               reviews: prev.reviews - 1,
// //                             }))
// //                           }>
// //                           Previous
// //                         </Button>
// //                         <span className='flex items-center px-4'>
// //                           Page {pageState.reviews} of {totalReviewPages}
// //                         </span>
// //                         <Button
// //                           variant='outline'
// //                           className='ml-2'
// //                           disabled={pageState.reviews === totalReviewPages}
// //                           onClick={() =>
// //                             setPageState((prev) => ({
// //                               ...prev,
// //                               reviews: prev.reviews + 1,
// //                             }))
// //                           }>
// //                           Next
// //                         </Button>
// //                       </Pagination>
// //                     </div>
// //                   )}
// //                 </div>
// //               ) : (
// //                 <div className='text-center py-8 text-secondary-text'>
// //                   No reviews yet. Be the first to review this game!
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           <div className='mt-16 space-y-8'>
// //             {filteredRelatedProducts?.length ? (
// //               <GameListing
// //                 title='Related Games'
// //                 games={filteredRelatedProducts}
// //                 currentPage={responseRelated?.data.currentPage}
// //                 totalPage={responseRelated?.data.totalPages}
// //                 onPageChange={(page) =>
// //                   setPageState((prev) => ({ ...prev, relatedGames: page }))
// //                 }
// //               />
// //             ) : (
// //               <RelatedGamesFallback />
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     )
// //   );
// // }


// "use client"

// import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { MapPin, Package, User, DollarSign } from "lucide-react"
// import { motion } from "framer-motion"
// import { useState } from "react"

// interface Order {
//   _id: string
//   placedAt: string
//   orderStatus: string
//   user?: {
//     name?: string
//   }
//   paymentMethod: string
//   paymentStatus: string
//   shippingAddress?: {
//     name: string
//     street: string
//     city: string
//     state: string
//     zipCode: string
//     phone: string
//   }
//   orderItems: {
//     product?: {
//       images?: string[]
//       name?: string
//     }
//     quantity: number
//     price: number
//     discount: number
//     status: string
//   }[]
//   totalAmount: number
//   totalDiscount: number
//   couponCode: string
//   couponDiscount: number
//   finalPrice: number
//   refundedAmount: number
//   deliveryBy?: string
//   updatedAt: string
// }

// interface OrderDialogProps {
//   selectedOrder: Order | null
//   onUpdateStatus: (orderId: string, newStatus: string) => Promise<void>
// }

// export function OrderDialog({ selectedOrder, onUpdateStatus }: OrderDialogProps) {
//   const [newStatus, setNewStatus] = useState(selectedOrder?.orderStatus || "Processing")
//   const [isUpdating, setIsUpdating] = useState(false)

//   const handleUpdateStatus = async () => {
//     if (!selectedOrder) return

//     setIsUpdating(true)
//     try {
//       await onUpdateStatus(selectedOrder._id, newStatus)
//     } catch (error) {
//       console.error("Failed to update status:", error)
//     } finally {
//       setIsUpdating(false)
//     }
//   }

//   if (!selectedOrder) {
//     return null // Or some other fallback UI
//   }

//   const { order } = { order: selectedOrder }

//   return (
//     selectedOrder && (
//       <DialogContent className="sm:max-w-[800px] p-0 bg-secondary-bg border-none text-primary-text overflow-hidden">
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
//           <div className="bg-accent-blue text-white p-6 rounded-t-lg">
//             <DialogHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
//                 <p className="text-white/80 mt-1">
//                   {new Date(order.placedAt).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </p>
//               </div>
//               <Badge
//                 variant={
//                   order.orderStatus === "Delivered"
//                     ? "success"
//                     : order.orderStatus === "Cancelled"
//                       ? "destructive"
//                       : "default"
//                 }
//                 className="px-3 py-1.5 text-sm"
//               >
//                 {order.orderStatus}
//               </Badge>
//             </DialogHeader>
//           </div>

//           <div className="p-6">
//             {/* Order Summary Section */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//               <div className="flex items-start space-x-3">
//                 <Package className="w-5 h-5 text-accent-blue mt-1 flex-shrink-0" />
//                 <div>
//                   <p className="text-sm text-secondary-text">Order ID</p>
//                   <p className="font-medium text-sm break-all">{order._id}</p>
//                 </div>
//               </div>

//               <div className="flex items-start space-x-3">
//                 <User className="w-5 h-5 text-accent-blue mt-1 flex-shrink-0" />
//                 <div>
//                   <p className="text-sm text-secondary-text">Customer</p>
//                   <p className="font-medium">{order.user?.name || "N/A"}</p>
//                 </div>
//               </div>

//               <div className="flex items-start space-x-3">
//                 <DollarSign className="w-5 h-5 text-accent-blue mt-1 flex-shrink-0" />
//                 <div>
//                   <p className="text-sm text-secondary-text">Payment Method</p>
//                   <div className="flex items-center gap-2">
//                     <p className="font-medium">{order.paymentMethod}</p>
//                     <Badge
//                       variant={
//                         order.paymentStatus === "Paid"
//                           ? "success"
//                           : order.paymentStatus === "Failed"
//                             ? "destructive"
//                             : "default"
//                       }
//                       className="text-xs"
//                     >
//                       {order.paymentStatus}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address */}
//             {order.shippingAddress && (
//               <div className="bg-primary-bg/30 rounded-lg p-4 mb-6">
//                 <h3 className="font-medium mb-2 flex items-center gap-2">
//                   <MapPin className="h-4 w-4 text-accent-blue" />
//                   Shipping Address
//                 </h3>
//                 <div className="text-sm text-secondary-text">
//                   <p>{order.shippingAddress.name}</p>
//                   <p>
//                     {order.shippingAddress.street}, {order.shippingAddress.city}
//                   </p>
//                   <p>
//                     {order.shippingAddress.state}, {order.shippingAddress.zipCode}
//                   </p>
//                   <p>Phone: {order.shippingAddress.phone}</p>
//                 </div>
//               </div>
//             )}

//             {/* Order Items */}
//             <div className="mb-6">
//               <h3 className="font-medium mb-3">Order Items</h3>
//               <div className="bg-primary-bg/30 rounded-lg overflow-hidden">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-primary-bg/50">
//                       <TableHead className="w-[50px]"></TableHead>
//                       <TableHead>Product</TableHead>
//                       <TableHead className="text-center">Quantity</TableHead>
//                       <TableHead className="text-center">Price</TableHead>
//                       <TableHead className="text-center">Status</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {order.orderItems.map((item, index) => (
//                       <TableRow key={index}>
//                         <TableCell className="p-2">
//                           <div className="h-12 w-12 rounded bg-primary-bg/50 overflow-hidden">
//                             <img
//                               src={item.product?.images?.[0] || "/placeholder.svg"}
//                               alt={item.product?.name}
//                               className="h-full w-full object-cover"
//                             />
//                           </div>
//                         </TableCell>
//                         <TableCell className="font-medium">{item.product?.name}</TableCell>
//                         <TableCell className="text-center">{item.quantity}</TableCell>
//                         <TableCell className="text-center">
//                           <div className="flex flex-col items-center">
//                             <span>₹{item.price.toFixed(2)}</span>
//                             {item.discount > 0 && (
//                               <span className="text-xs text-accent-red">-₹{item.discount.toFixed(2)}</span>
//                             )}
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-center">
//                           <Badge
//                             variant={
//                               item.status === "Delivered"
//                                 ? "success"
//                                 : item.status === "Cancelled" || item.status === "Returned"
//                                   ? "destructive"
//                                   : "default"
//                             }
//                           >
//                             {item.status}
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <h3 className="font-medium mb-3">Delivery Information</h3>
//                 <div className="bg-primary-bg/30 rounded-lg p-4 space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-secondary-text">Order Date:</span>
//                     <span>{new Date(order.placedAt).toLocaleDateString()}</span>
//                   </div>

//                   {order.deliveryBy && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-secondary-text">Expected Delivery:</span>
//                       <span>{new Date(order.deliveryBy).toLocaleDateString()}</span>
//                     </div>
//                   )}

//                   {order.orderStatus === "Delivered" && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-secondary-text">Delivered On:</span>
//                       <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <h3 className="font-medium mb-3">Payment Summary</h3>
//                 <div className="bg-primary-bg/30 rounded-lg p-4 space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-secondary-text">Subtotal:</span>
//                     <span>₹{order.totalAmount.toFixed(2)}</span>
//                   </div>

//                   {order.totalDiscount > 0 && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-secondary-text">Item Discount:</span>
//                       <span className="text-accent-red">-₹{order.totalDiscount.toFixed(2)}</span>
//                     </div>
//                   )}

//                   {order.couponCode && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-secondary-text">Coupon ({order.couponCode}):</span>
//                       <span className="text-accent-red">-₹{order.couponDiscount.toFixed(2)}</span>
//                     </div>
//                   )}

//                   <div className="flex justify-between font-medium pt-2 border-t border-primary-bg/50">
//                     <span>Total:</span>
//                     <span>₹{order.finalPrice.toFixed(2)}</span>
//                   </div>

//                   {order.refundedAmount > 0 && (
//                     <div className="flex justify-between text-sm text-accent-green">
//                       <span>Refunded:</span>
//                       <span>₹{order.refundedAmount.toFixed(2)}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Status Update Section */}
//             <div className="border-t border-primary-bg/30 pt-6 mt-6">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
//                 <div className="md:col-span-2 space-y-2">
//                   <label htmlFor="status" className="block text-sm font-medium text-secondary-text">
//                     Update Order Status
//                   </label>
//                   <Select onValueChange={(value) => setNewStatus(value)} defaultValue={order.orderStatus}>
//                     <SelectTrigger className="bg-primary-bg border-accent-blue/30 focus:ring-accent-blue">
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Processing">Processing</SelectItem>
//                       <SelectItem value="Shipped">Shipped</SelectItem>
//                       <SelectItem value="Delivered">Delivered</SelectItem>
//                       <SelectItem value="Cancelled">Cancelled</SelectItem>
//                       <SelectItem value="Returned">Returned</SelectItem>
//                       <SelectItem value="Return Requested">Return Requested</SelectItem>
//                       <SelectItem value="Partially Cancelled">Partially Cancelled</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <Button
//                   className="bg-accent-blue hover:bg-accent-blue/90 text-white"
//                   onClick={handleUpdateStatus}
//                   disabled={isUpdating}
//                 >
//                   {isUpdating ? "Updating..." : "Update Status"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </DialogContent>
//     )
//   )
// }


// {item.status === "Return Requested" && (
//                                                   <div className="flex flex-col gap-2 mt-1">
//                                                     {item.returnRequest?.reason && (
//                                                       <p className="text-xs text-secondary-text">
//                                                         Reason: {item.returnRequest.reason}
//                                                       </p>
//                                                     )}
//                                                     <div className="flex gap-2">
//                                                       <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         className="bg-green-500 hover:bg-green-600 text-white border-none"
//                                                         onClick={() =>
//                                                           handleReturnRequest(order._id, item.product._id, "approve")
//                                                         }
//                                                         disabled={isProcessingReturn}
//                                                       >
//                                                         Approve
//                                                       </Button>
//                                                       <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         className="bg-red-500 hover:bg-red-600 text-white border-none"
//                                                         onClick={() =>
//                                                           handleReturnRequest(order._id, item.product._id, "reject")
//                                                         }
//                                                         disabled={isProcessingReturn}
//                                                       >
//                                                         Reject
//                                                       </Button>
//                                                     </div>
//                                                   </div>
//                                                 )}

  // const handleReturnRequest = async (orderId, productId, action) => {
  //   try {
  //     await requestReturnAdmin({
  //       orderId,
  //       productId,
  //       action,
  //     }).unwrap();

  //     toast.success(
  //       `Return request ${
  //         action === 'approve' ? 'approved' : 'rejected'
  //       } successfully`,
  //       { duration: 1500 }
  //     );
  //   } catch (error) {
  //     console.error('Error processing return request:', error);
  //     toast.error(
  //       error?.data?.message || 'Failed to process the return request'
  //     );
  //   }
  // };