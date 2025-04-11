import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import { useAddOfferMutation } from '@/redux/api/admin/offersApi';
import { useGetAllProductsQuery } from '@/redux/api/admin/productsApi';
import { useGetAllBrandsQuery } from '@/redux/api/admin/brandsApi';
import { toast } from 'sonner';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  InputField,
  SelectField,
  DatePicker,
} from '@/components/common';
import { validateOffer, mapOptionsData } from '@/utils';

const initialOfferState = {
  name: '',
  type: '',
  targetId: '',
  discountType: '',
  discountValue: '',
  startDate: undefined,
  endDate: undefined,
};

export const AddOffer = () => {
  const navigate = useNavigate();

  // Fetching products and brands
  const { data: responseProducts, isSuccess: productsSuccess } =
    useGetAllProductsQuery({ limit: 10000 });

  const { data: responseBrands, isSuccess: brandsSuccess } =
    useGetAllBrandsQuery({});

  const [addOffer, { isError, error, isLoading: isAddOfferLoading }] =
    useAddOfferMutation();

  // Offer state
  const [offerInput, setOfferInput] = useState(initialOfferState);
  const [offerValidation, setOfferValidation] = useState(initialOfferState);

  useEffect(() => {
    setOfferValidation(initialOfferState);
  }, [offerInput]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferInput((prev) => ({ ...prev, [name]: value }));
  };

  // Mapping options for products and brands
  const productOptions = productsSuccess
    ? mapOptionsData(responseProducts?.data?.products)
    : [];
  const brandOptions = brandsSuccess
    ? mapOptionsData(responseBrands?.data?.brands)
    : [];

  const typeOptions = [
    { label: 'Product', value: 'Product' },
    { label: 'Brand', value: 'Brand' },
  ];

  const discountTypeOptions = [
    { label: 'Percentage (%)', value: 'percentage' },
    { label: 'Fixed Amount (₹)', value: 'amount' },
  ];

  const filteredDiscountTypeOptions =
    offerInput.type === 'Brand'
      ? discountTypeOptions.filter((option) => option.value === 'percentage')
      : discountTypeOptions;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateOffer(offerInput);
    if (Object.keys(validationErrors).length > 0) {
      setOfferValidation(validationErrors);
      return;
    }

    try {
      const response = await addOffer(offerInput).unwrap();

      if (response.success) {
        toast.success(response.message, { duration: 1500 });
        navigate('/admin/offers');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg shadow-none border-0 text-primary-text'>
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
            onChange={handleChange}
            label='Offer Type'
            name='type'
            options={typeOptions}
            placeholder='Select Offer Type'
            isInvalid={!!offerValidation.type}
            errorMessage={offerValidation.type}
          />

          {offerInput.type === 'Product' && (
            <SelectField
              value={offerInput.targetId}
              onChange={handleChange}
              label='Target Product'
              name='targetId'
              options={productOptions}
              placeholder='Select a Product'
              isInvalid={!!offerValidation.targetId}
              errorMessage={offerValidation.targetId}
            />
          )}

          {offerInput.type === 'Brand' && (
            <SelectField
              value={offerInput.targetId}
              onChange={handleChange}
              label='Target Brand'
              name='targetId'
              options={brandOptions}
              placeholder='Select a Brand'
              isInvalid={!!offerValidation.targetId}
              errorMessage={offerValidation.targetId}
            />
          )}

          <div className='flex space-x-4'>
            <DatePicker
              value={offerInput.startDate}
              onChange={handleChange}
              label='Start Date'
              name='startDate'
              placeHolder='Select start date'
              isInvalid={!!offerValidation.startDate}
              errorMessage={offerValidation.startDate}
              helperText='Select when this discount should start'
            />

            <DatePicker
              value={offerInput.endDate}
              onChange={handleChange}
              label='End Date'
              name='endDate'
              placeHolder='Select end date'
              isInvalid={!!offerValidation.endDate}
              errorMessage={offerValidation.endDate}
              helperText='Select when this discount expires'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <SelectField
              value={offerInput.discountType}
              onChange={handleChange}
              label='Discount Type'
              name='discountType'
              options={filteredDiscountTypeOptions}
              placeholder='Select Discount Type'
              isInvalid={!!offerValidation.discountType}
              errorMessage={offerValidation.discountType}
            />

            <InputField
              type='number'
              value={offerInput.discountValue}
              onChange={handleChange}
              label='Discount Value'
              name='discountValue'
              placeHolder='Enter discount value'
              isInvalid={!!offerValidation.discountValue}
              errorMessage={offerValidation.discountValue}
            />
          </div>

          <Button
            type='submit'
            className='w-full bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2 rounded-md'
            disabled={isAddOfferLoading}>
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
