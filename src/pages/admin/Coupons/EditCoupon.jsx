import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import {
  useGetOneCouponQuery,
  useEditCouponMutation,
} from '@/redux/api/admin/couponsApi';
import { toast } from 'sonner';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  DatePicker,
  InputField,
  SelectField,
} from '@/components/common';
import { validateCoupon } from '@/utils';
import { Loading } from '@/components/error';

const initialCouponState = {
  code: '',
  discountType: '',
  discountValue: null,
  minOrderAmount: null,
  maxDiscountAmount: null,
  usageLimit: null,
  perUserLimit: null,
  startDate: undefined,
  endDate: undefined,
};

export const EditCoupon = () => {
  const navigate = useNavigate();
  const { couponId } = useParams();

  // Fetching the specific coupon details
  const {
    data: responseCoupon,
    isError,
    error,
    isLoading: isCouponLoading,
  } = useGetOneCouponQuery(couponId);

  const [editCoupon, { isError: isEditCouponError, error: editCouponError }] =
    useEditCouponMutation();

  const [couponInput, setCouponInput] = useState(initialCouponState);
  const [couponValidation, setCouponValidation] = useState(initialCouponState);

  useEffect(() => {
    if (responseCoupon) {
      setCouponInput((prevInput) => ({
        ...prevInput,
        code: responseCoupon.data.code,
        discountType: responseCoupon.data.discountType,
        discountValue: responseCoupon.data.discountValue,
        minOrderAmount: responseCoupon.data.minOrderAmount,
        maxDiscountAmount: responseCoupon.data.maxDiscountAmount,
        usageLimit: responseCoupon.data.usageLimit,
        perUserLimit: responseCoupon.data.perUserLimit,
        startDate: new Date(responseCoupon.data.startDate),
        endDate: new Date(responseCoupon.data.endDate),
      }));
    }
  }, [responseCoupon]);

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

    const validationErrors = validateCoupon(couponInput, true);
    if (Object.keys(validationErrors).length > 0) {
      setCouponValidation(validationErrors);
      return;
    }

    try {
      const response = await editCoupon({
        couponId,
        ...couponInput,
      }).unwrap();

      if (response?.success) {
        toast.success(response.message, { duration: 1500 });
        setTimeout(() => navigate('/admin/coupons'), 1500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!responseCoupon || isCouponLoading) {
    return <Loading />;
  }

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg shadow-none border-0 text-primary-text'>
      <CardHeader className='bg-primary-bg/10'>
        <CardTitle className='text-2xl font-bold text-center text-primary-text'>
          Edit Coupon
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
            Update Coupon
          </Button>
        </form>

        {isError ? (
          <Alert
            Icon={CircleX}
            variant='destructive'
            description={
              error?.data?.message || 'Something went wrong! Please try again.'
            }
          />
        ) : isEditCouponError ? (
          <Alert
            Icon={CircleX}
            variant='destructive'
            description={
              editCouponError?.data?.message ||
              'Something went wrong! Please try again.'
            }
          />
        ) : null}
      </CardContent>
    </Card>
  );
};
