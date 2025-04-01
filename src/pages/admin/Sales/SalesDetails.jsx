import { format } from 'date-fns';
import { useGetSalesDataQuery } from '@/redux/api/admin/salesApi';
import { CircleX, DollarSign, Package } from 'lucide-react';
import { Alert, EmptyState } from '@/components/common';
import { Badge } from '@/shadcn/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/ui/card';
import { Button } from '@/shadcn/components/ui/button';

export const SalesDetails = ({ saleId, setSelectedSale }) => {
  const {
    data: responseSalesData,
    isError,
    error,
    isLoading,
  } = useGetSalesDataQuery({ page: 1, limit: 10 });

  // Find the specific sale by ID
  const sale = responseSalesData?.data?.sales?.find((s) => s._id === saleId);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-blue'></div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        Icon={CircleX}
        variant='destructive'
        description={
          error?.data?.message || 'Something went wrong! Please try again.'
        }
      />
    );
  }

  if (!sale) {
    return (
      <EmptyState
        icon={DollarSign}
        title='Sale not found'
        description='The requested sale details could not be found.'
      />
    );
  }

  return (
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='mb-6 flex justify-between'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-primary-text mb-4'>
            Sale Details
          </h1>
          <div className='text-sm text-secondary-text'>
            Order ID: <span className='font-semibold'>{sale._id}</span>
          </div>
        </div>
        <Button
          className='bg-accent-red hover:bg-hover-red'
          onClick={() => setSelectedSale(null)}>
          {' '}
          Go Back{' '}
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <Card className='bg-secondary-bg border border-accent-blue/20'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-secondary-text'>
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-lg font-semibold text-primary-text'>
              {sale.user.name}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-secondary-bg border border-accent-blue/20'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-secondary-text'>
              Order Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-lg font-semibold text-primary-text'>
              {format(new Date(sale.placedAt), 'dd MMM yyyy, HH:mm')}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-secondary-bg border border-accent-blue/20'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-secondary-text'>
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-lg font-semibold text-primary-text'>
              ₹{sale.finalPrice.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        <Card className='bg-secondary-bg border border-accent-blue/20'>
          <CardHeader>
            <CardTitle className='text-primary-text'>
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-1 text-secondary-text'>
              <p>{sale.shippingAddress.addressName}</p>
              <p>{sale.shippingAddress.addressLine}</p>
              <p>
                {sale.shippingAddress.city}, {sale.shippingAddress.state}{' '}
                {sale.shippingAddress.zip}
              </p>
              <p>{sale.shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-secondary-bg border border-accent-blue/20'>
          <CardHeader>
            <CardTitle className='text-primary-text'>
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-secondary-text'>Method:</span>
                <span className='text-primary-text font-medium'>
                  {sale.paymentMethod}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-secondary-text'>Status:</span>
                <Badge
                  variant={
                    sale.paymentStatus === 'Paid' ? 'success' : 'warning'
                  }>
                  {sale.paymentStatus}
                </Badge>
              </div>
              <div className='flex justify-between'>
                <span className='text-secondary-text'>Subtotal:</span>
                <span className='text-primary-text font-medium'>
                  ₹{sale.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-secondary-text'>Discount:</span>
                <span className='text-primary-text font-medium'>
                  ₹{sale.totalDiscount.toFixed(2)}
                </span>
              </div>
              {sale.couponDiscount > 0 && (
                <div className='flex justify-between'>
                  <span className='text-secondary-text'>Coupon Discount:</span>
                  <span className='text-primary-text font-medium'>
                    ₹{sale.couponDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className='flex justify-between pt-2 border-t border-accent-blue/20'>
                <span className='text-secondary-text font-semibold'>
                  Total:
                </span>
                <span className='text-primary-text font-bold'>
                  ₹{sale.finalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='bg-secondary-bg border border-accent-blue/20 mb-6'>
        <CardHeader>
          <CardTitle className='text-primary-text'>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          {sale.orderItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className='bg-secondary-bg/10 border-b border-accent-blue'>
                  <TableHead className='px-2 py-3 text-xs md:text-sm text-left font-semibold text-primary-text'>
                    Product ID
                  </TableHead>
                  <TableHead className='px-2 py-3 text-xs md:text-sm text-center font-semibold text-primary-text'>
                    Quantity
                  </TableHead>
                  <TableHead className='px-2 py-3 text-xs md:text-sm text-center font-semibold text-primary-text'>
                    Price
                  </TableHead>
                  <TableHead className='px-2 py-3 text-xs md:text-sm text-center font-semibold text-primary-text'>
                    Discount
                  </TableHead>
                  <TableHead className='px-2 py-3 text-xs md:text-sm text-right font-semibold text-primary-text'>
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.orderItems.map((item, index) => (
                  <TableRow
                    key={index}
                    className='transition-colors duration-200 hover:bg-primary-bg/20'>
                    <TableCell className='px-2 py-3 text-left text-xs md:text-sm text-secondary-text border-b border-accent-blue/20'>
                      {item.product}
                    </TableCell>
                    <TableCell className='px-2 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20'>
                      {item.quantity}
                    </TableCell>
                    <TableCell className='px-2 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20'>
                      ₹{item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className='px-2 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20'>
                      ₹{item.discount.toFixed(2)}
                    </TableCell>
                    <TableCell className='px-2 py-3 text-right text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 font-medium'>
                      ₹{item.totalPrice.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Package}
              title='No items'
              description='This order does not contain any items.'
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
