import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import { useAddCouponMutation } from '@/redux/api/admin/couponsApi';
import { toast } from 'sonner';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  InputField,
  SelectField,
  DatePicker,
} from '@/components/common';
import { validateCoupon } from '@/utils';

const initialCouponState = {
  code: '',
  discountType: '',
  discountValue: '',
  minOrderAmount: '',
  maxDiscountAmount: '',
  usageLimit: '',
  perUserLimit: '',
  startDate: '',
  endDate: '',
};

export const AddCoupon = () => {
  const navigate = useNavigate();
  const [addCoupon, { isError, error }] = useAddCouponMutation();

  // Coupon state
  const [couponInput, setCouponInput] = useState(initialCouponState);
  const [couponValidation, setCouponValidation] = useState(initialCouponState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponInput((prev) => ({ ...prev, [name]: value }));
    setCouponValidation((prev) => ({ ...prev, [name]: '' }));
  };

  const discountTypeOptions = [
    { label: 'Percentage (%)', value: 'percentage' },
    { label: 'Fixed Amount (₹)', value: 'amount' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateCoupon(couponInput);
    if (Object.keys(validationErrors).length > 0) {
      setCouponValidation(validationErrors);
      return;
    }

    try {
      const response = await addCoupon(couponInput).unwrap();

      if (response.success) {
        toast.success(response.message, { duration: 1500 });
        navigate('/admin/coupons');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg shadow-none border-0 text-primary-text'>
      <CardHeader className='bg-primary-bg/10'>
        <CardTitle className='text-2xl font-bold text-center text-primary-text'>
          Add New Coupon
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-6'>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          <InputField
            type='text'
            value={couponInput.code}
            onChange={handleChange}
            label='Coupon Code'
            name='code'
            placeHolder='Enter coupon code'
            isInvalid={!!couponValidation.code}
            errorMessage={couponValidation.code}
          />

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <SelectField
              value={couponInput.discountType}
              onChange={handleChange}
              label='Discount Type'
              name='discountType'
              options={discountTypeOptions}
              placeholder='Select Discount Type'
              isInvalid={!!couponValidation.discountType}
              errorMessage={couponValidation.discountType}
            />

            <InputField
              type='number'
              value={couponInput.discountValue}
              onChange={handleChange}
              label='Discount Value'
              name='discountValue'
              placeHolder='Enter discount value'
              isInvalid={!!couponValidation.discountValue}
              errorMessage={couponValidation.discountValue}
            />
          </div>
          <div className='flex space-x-4'>
            <DatePicker
              value={couponInput.startDate}
              onChange={handleChange}
              label='Start Date'
              name='startDate'
              placeHolder='Select start date'
              isInvalid={!!couponValidation.startDate}
              errorMessage={couponValidation.startDate}
              helperText={
                !couponValidation.startDate
                  ? 'Select when this coupon should start'
                  : null
              }
            />

            <DatePicker
              value={couponInput.endDate}
              onChange={handleChange}
              label='End Date'
              name='endDate'
              placeHolder='Select end date'
              isInvalid={!!couponValidation.endDate}
              errorMessage={couponValidation.endDate}
              helperText={
                !couponValidation.endDate
                  ? 'Select when this coupon expires'
                  : null
              }
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <InputField
              type='number'
              value={couponInput.minOrderAmount}
              onChange={handleChange}
              label='Minimum Order Amount (₹)'
              name='minOrderAmount'
              placeHolder='Enter minimum order amount'
              isInvalid={!!couponValidation.minOrderAmount}
              errorMessage={couponValidation.minOrderAmount}
              helperText={
                !couponValidation.minOrderAmount
                  ? 'Minimum cart value required to apply this coupon'
                  : null
              }
            />

            <InputField
              type='number'
              value={couponInput.maxDiscountAmount}
              onChange={handleChange}
              label='Maximum Discount Amount (₹)'
              name='maxDiscountAmount'
              placeHolder='Enter maximum discount amount'
              isInvalid={!!couponValidation.maxDiscountAmount}
              errorMessage={couponValidation.maxDiscountAmount}
              helperText={
                !couponValidation.maxDiscountAmount
                  ? 'Maximum discount limit (leave empty for no limit)'
                  : null
              }
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <InputField
              type='number'
              value={couponInput.usageLimit}
              onChange={handleChange}
              label='Usage Limit'
              name='usageLimit'
              placeHolder='Enter usage limit'
              isInvalid={!!couponValidation.usageLimit}
              errorMessage={couponValidation.usageLimit}
              helperText={
                !couponValidation.usageLimit
                  ? 'Total number of times this coupon can be used'
                  : null
              }
            />

            <InputField
              type='number'
              value={couponInput.perUserLimit}
              onChange={handleChange}
              label='Per-User Limit'
              name='perUserLimit'
              placeHolder='Enter per-user limit'
              isInvalid={!!couponValidation.perUserLimit}
              errorMessage={couponValidation.perUserLimit}
              helperText={
                !couponValidation.perUserLimit
                  ? 'Maximum times a single user can use this coupon'
                  : null
              }
            />
          </div>

          <Button
            type='submit'
            className='w-full bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2 rounded-md'>
            Add Coupon
          </Button>
        </form>

        {isError && (
          <Alert
            Icon={CircleX}
            variant='destructive'
            description={
              error?.data?.message || 'Something went wrong! Please try again.'
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
