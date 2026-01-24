import { useState } from 'react';
import {
  useGetAllProductsQuery,
  useToggleProductListMutation,
} from '@/redux/api/admin/productsApi';
import { Button } from '@/shadcn/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/ui/card';
import { Badge } from '@/shadcn/components/ui/badge';
import { ConfirmationModal, EmptyState } from '@/components/common';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Check, X, ShoppingCart, Gamepad2 } from 'lucide-react';
import { AdminPagination } from '@/components/admin';
import { handleApiError, showToast } from '@/utils';
import { ContainerLoading } from '@/components/error';

export const ProductList = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: responseGetProducts, isLoading } = useGetAllProductsQuery({
    page: currentPage,
    limit: 6,
  });

  const [toggleProductList] = useToggleProductListMutation();

  const products = responseGetProducts?.data?.products || [];

  const handleListingModal = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleConfirmListing = async () => {
    try {
      const res = await toggleProductList(selectedProductId).unwrap();
      if (res.success) {
        showToast.success(res.message);
      }
      setIsModalOpen(false);
    } catch (err) {
      handleApiError(err, 'There was some error listing product');
    }
  };

  const handleCancelListing = () => {
    setSelectedProductId(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <ContainerLoading />;
  }

  return (
    <Card className='w-full h-full shadow-sm border-0 bg-secondary-bg'>
      <CardHeader className='pb-0'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <CardTitle className='text-2xl font-medium text-primary-text flex items-center gap-2'>
            <Gamepad2 className='h-5 w-5' />
            Products
          </CardTitle>

          <Link to='/admin/products/add'>
            <Button className='bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2'>
              <Plus className='mr-2 h-4 w-4' />
              Add Product
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className='p-6'>
        <div className='w-full space-y-4'>
          {products.length ? (
            <div className='grid gap-4'>
              {products.map((product) => (
                <Card
                  key={product._id}
                  className='overflow-hidden border-0 shadow-sm hover:shadow transition-shadow bg-primary-bg/20'>
                  <CardContent className='p-0'>
                    <div className='flex flex-col md:flex-row justify-between p-4 gap-4 md:items-center'>
                      {/* Left: Product Name + Price */}
                      <div className='min-w-[200px]'>
                        <p className='font-medium text-primary-text'>
                          {product.name}
                        </p>
                        <p className='text-sm text-secondary-text'>
                          ₹{product.price}
                        </p>
                      </div>

                      {/* Middle: Fixed badge block */}
                      {/* Right: Badge grid + action buttons */}
                      <div className='ml-auto flex flex-col md:flex-row items-center gap-4'>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-white'>
                          <Badge
                            variant='outline'
                            className='w-[110px] h-10 text-xs truncate text-center justify-center items-center flex bg-primary-bg/60 border-accent-blue/20'>
                            {product.genre?.name || 'N/A'}
                          </Badge>
                          <Badge
                            variant='outline'
                            className='w-[110px] h-10 text-xs truncate text-center justify-center items-center flex bg-primary-bg/60 border-accent-blue/20'>
                            {product.platform || 'N/A'}
                          </Badge>
                          <Badge
                            variant='outline'
                            className='w-[110px] h-10 text-xs truncate text-center justify-center items-center flex bg-primary-bg/60 border-accent-blue/20'>
                            {product.stock > 0
                              ? `Stock: ${product.stock}`
                              : 'Out of Stock'}
                          </Badge>
                          <Badge
                            variant={product.isActive ? 'default' : 'secondary'}
                            className={`w-[110px] h-10 text-xs truncate text-center justify-center items-center flex ${
                              product.isActive
                                ? 'bg-green-500/20 text-green-600'
                                : 'bg-red-500/20 text-red-600'
                            }`}>
                            {product.isActive ? 'Listed' : 'Unlisted'}
                          </Badge>
                        </div>

                        <div className='flex items-center gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-blue-600 hover:bg-hover-blue'
                            onClick={() =>
                              navigate(`/admin/products/edit/${product._id}`)
                            }>
                            Edit
                          </Button>

                          <Button
                            variant='ghost'
                            size='sm'
                            className={`min-w-[100px] justify-center ${
                              product.isActive
                                ? 'text-red-600 hover:bg-hover-red'
                                : 'text-green-600 hover:bg-hover-green'
                            }`}
                            onClick={() => handleListingModal(product._id)}>
                            {product.isActive ? (
                              <>
                                <X className='h-4 w-4 mr-1' /> Unlist
                              </>
                            ) : (
                              <>
                                <Check className='h-4 w-4 mr-1' /> List
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ShoppingCart}
              title='No products available'
              description='There are no products to display at the moment.'
            />
          )}
        </div>

        <div className='mt-6 flex justify-center text-white'>
          {responseGetProducts?.data?.totalPages > 1 && (
            <AdminPagination
              currentPage={currentPage}
              totalPages={responseGetProducts?.data?.totalPages || 0}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      </CardContent>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelListing}
        onConfirm={handleConfirmListing}
        title='Confirm Action'
        description='Are you sure you want to proceed with this action?'
      />
    </Card>
  );
};
