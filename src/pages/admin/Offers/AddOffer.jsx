import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, InputField, SelectField } from '@/components/common';
import { toast } from 'sonner';

const initialOfferState = {
  name: '',
  type: '',
  discountType: '',
  discountValue: '',
  expirationDate: '',
  status: 'Active',
  description: '',
  applicableProducts: [],
  applicableCategories: [],
  minPurchaseAmount: '',
  maxUsagePerUser: '',
  code: '',
};

const validateOffer = (offer) => {
  const errors = {};

  if (!offer.name.trim()) {
    errors.name = 'Offer name is required';
  }

  if (!offer.type) {
    errors.type = 'Offer type is required';
  }

  if (!offer.discountType) {
    errors.discountType = 'Discount type is required';
  }

  if (!offer.discountValue) {
    errors.discountValue = 'Discount value is required';
  } else if (isNaN(offer.discountValue) || Number(offer.discountValue) <= 0) {
    errors.discountValue = 'Discount value must be a positive number';
  } else if (
    offer.discountType === 'percentage' &&
    (Number(offer.discountValue) < 1 || Number(offer.discountValue) > 100)
  ) {
    errors.discountValue = 'Percentage discount must be between 1 and 100';
  }

  if (!offer.expirationDate) {
    errors.expirationDate = 'Expiration date is required';
  } else {
    const currentDate = new Date();
    const expirationDate = new Date(offer.expirationDate);
    if (expirationDate < currentDate) {
      errors.expirationDate = 'Expiration date must be in the future';
    }
  }

  if (!offer.status) {
    errors.status = 'Status is required';
  }

  if (offer.minPurchaseAmount && isNaN(offer.minPurchaseAmount)) {
    errors.minPurchaseAmount = 'Minimum purchase amount must be a number';
  }

  if (offer.maxUsagePerUser && isNaN(offer.maxUsagePerUser)) {
    errors.maxUsagePerUser = 'Maximum usage per user must be a number';
  }

  if (offer.type === 'coupon' && !offer.code.trim()) {
    errors.code = 'Coupon code is required';
  }

  if (offer.type === 'product' && offer.applicableProducts.length === 0) {
    errors.applicableProducts = 'At least one product must be selected';
  }

  if (offer.type === 'category' && offer.applicableCategories.length === 0) {
    errors.applicableCategories = 'At least one category must be selected';
  }

  return errors;
};

export const AddOffer = () => {
  const navigate = useNavigate();

  // Mock API calls
  const [addOffer, { isError, error }] = [
    async (offerData) => {
      console.log('Adding offer:', offerData);
      return { success: true, message: 'Offer added successfully' };
    },
    { isError: false, error: null },
  ];

  // Mock data for products and categories
  const { data: responseProducts, isSuccess: productsSuccess } = {
    data: {
      data: {
        products: [
          { id: '1', name: 'Game 1' },
          { id: '2', name: 'Game 2' },
          { id: '3', name: 'Game 3' },
        ],
      },
    },
    isSuccess: true,
  };

  const { data: responseCategories, isSuccess: categoriesSuccess } = {
    data: {
      data: {
        genres: [
          { id: '1', name: 'Action' },
          { id: '2', name: 'Adventure' },
          { id: '3', name: 'RPG' },
        ],
      },
    },
    isSuccess: true,
  };

  const [offerInput, setOfferInput] = useState(initialOfferState);
  const [offerValidation, setOfferValidation] = useState({});

  useEffect(() => {
    setOfferValidation({});
  }, []); //Fixed unnecessary dependency

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setOfferInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name, selectedItems) => {
    setOfferInput((prev) => ({ ...prev, [name]: selectedItems }));
  };

  const offerTypeOptions = [
    { id: 'product', name: 'Product Specific' },
    { id: 'category', name: 'Category Specific' },
    { id: 'cart', name: 'Cart Discount' },
    { id: 'coupon', name: 'Coupon Code' },
  ];

  const discountTypeOptions = [
    { id: 'percentage', name: 'Percentage (%)' },
    { id: 'fixed', name: 'Fixed Amount (₹)' },
  ];

  const statusOptions = [
    { id: 'Active', name: 'Active' },
    { id: 'Inactive', name: 'Inactive' },
    { id: 'Scheduled', name: 'Scheduled' },
  ];

  const productOptions = productsSuccess
    ? responseProducts.data.products.map((product) => ({
        id: product.id,
        name: product.name,
      }))
    : [];

  const categoryOptions = categoriesSuccess
    ? responseCategories.data.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      }))
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateOffer(offerInput);
    if (Object.keys(validationErrors).length > 0) {
      setOfferValidation(validationErrors);
      return;
    }

    try {
      const response = await addOffer(offerInput);

      if (response.success) {
        toast.success(response.message, { duration: 1500 });
        navigate('/admin/offers');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg shadow-lg text-primary-text'>
      <CardHeader className='bg-primary-bg/10'>
        <CardTitle className='text-2xl font-bold text-center text-primary-text'>
          Add New Offer
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-6'>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          <InputField
            type='text'
            value={offerInput.name}
            onChange={handleChange}
            label='Offer Name'
            name='name'
            placeHolder='Enter offer name'
            isInvalid={!!offerValidation.name}
            errorMessage={offerValidation.name}
          />

          <SelectField
            value={offerInput.type}
            onChange={(e) => handleSelectChange('type', e.target.value)}
            label='Offer Type'
            name='type'
            options={offerTypeOptions}
            placeholder='Select offer type'
            isInvalid={!!offerValidation.type}
            errorMessage={offerValidation.type}
          />

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <SelectField
              value={offerInput.discountType}
              onChange={(e) =>
                handleSelectChange('discountType', e.target.value)
              }
              label='Discount Type'
              name='discountType'
              options={discountTypeOptions}
              placeholder='Select discount type'
              isInvalid={!!offerValidation.discountType}
              errorMessage={offerValidation.discountType}
            />

            <InputField
              type='text'
              value={offerInput.discountValue}
              onChange={handleChange}
              label='Discount Value'
              name='discountValue'
              placeHolder={
                offerInput.discountType === 'percentage' ? '10' : '100'
              }
              isInvalid={!!offerValidation.discountValue}
              errorMessage={offerValidation.discountValue}
              helperText={
                !offerValidation.discountValue
                  ? offerInput.discountType === 'percentage'
                    ? 'Enter percentage value (1-100)'
                    : 'Enter amount in rupees'
                  : ''
              }
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-primary-text'>
                Expiration Date
              </label>

              {offerValidation.expirationDate && (
                <span className='text-red-500 text-sm'>
                  {offerValidation.expirationDate}
                </span>
              )}
            </div>

            <SelectField
              value={offerInput.status}
              onChange={(e) => handleSelectChange('status', e.target.value)}
              label='Status'
              name='status'
              options={statusOptions}
              placeholder='Select status'
              isInvalid={!!offerValidation.status}
              errorMessage={offerValidation.status}
            />
          </div>

          {offerInput.type === 'coupon' && (
            <InputField
              type='text'
              value={offerInput.code}
              onChange={handleChange}
              label='Coupon Code'
              name='code'
              placeHolder='Enter coupon code'
              isInvalid={!!offerValidation.code}
              errorMessage={offerValidation.code}
              helperText='This code will be used by customers to apply the discount'
            />
          )}

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <InputField
              type='text'
              value={offerInput.minPurchaseAmount}
              onChange={handleChange}
              label='Minimum Purchase Amount'
              name='minPurchaseAmount'
              placeHolder='0.00'
              isInvalid={!!offerValidation.minPurchaseAmount}
              errorMessage={offerValidation.minPurchaseAmount}
              helperText='Leave empty for no minimum'
            />

            <InputField
              type='text'
              value={offerInput.maxUsagePerUser}
              onChange={handleChange}
              label='Max Usage Per User'
              name='maxUsagePerUser'
              placeHolder='1'
              isInvalid={!!offerValidation.maxUsagePerUser}
              errorMessage={offerValidation.maxUsagePerUser}
              helperText='Leave empty for unlimited usage'
            />
          </div>

          {offerInput.type === 'product' && (
            <SelectField
              value={offerInput.applicableProducts}
              onChange={(e) =>
                handleMultiSelectChange('applicableProducts', e.target.value)
              }
              label='Applicable Products'
              name='applicableProducts'
              options={productOptions}
              placeholder='Select products'
              isMulti={true}
              isInvalid={!!offerValidation.applicableProducts}
              errorMessage={offerValidation.applicableProducts}
            />
          )}

          {offerInput.type === 'category' && (
            <SelectField
              value={offerInput.applicableCategories}
              onChange={(e) =>
                handleMultiSelectChange('applicableCategories', e.target.value)
              }
              label='Applicable Categories'
              name='applicableCategories'
              options={categoryOptions}
              placeholder='Select categories'
              isMulti={true}
              isInvalid={!!offerValidation.applicableCategories}
              errorMessage={offerValidation.applicableCategories}
            />
          )}

          <div className='space-y-2'>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-primary-text'>
              Description
            </label>
            <Textarea
              id='description'
              name='description'
              value={offerInput.description}
              onChange={handleChange}
              placeholder='Enter offer description'
              className='w-full bg-[#262626] ring-0 focus:ring-2 text-primary-text rounded-md'
              rows={4}
            />
            {offerValidation.description && (
              <span className='text-red-500 text-sm mt-0'>
                {offerValidation.description}
              </span>
            )}
          </div>

          <Button
            type='submit'
            className='w-full bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2 rounded-md'>
            Add Offer
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
