import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import {
  useGetOneBrandQuery,
  useEditBrandMutation,
} from '@/redux/api/admin/adminApi';
import { toast } from 'sonner';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, InputField } from '@/components/common';
import { validateBrand } from '@/utils';

const initialBrandState = {
  name: '',
  description: '',
};

export const EditBrand = () => {
  const navigate = useNavigate();
  const { brandId } = useParams();

  // Fetching brand data
  const { data: responseBrand, isError, error } = useGetOneBrandQuery(brandId);

  const [editBrand, { isError: isEditBrandError, error: editBrandError }] =
    useEditBrandMutation();

  // Brand state
  const [brandInput, setBrandInput] = useState(initialBrandState);
  const [brandValidation, setBrandValidation] = useState(initialBrandState);

  useEffect(() => {
    if (responseBrand) {
      setBrandInput({
        name: responseBrand.data.name,
        description: responseBrand.data.description,
      });
    }
  }, [responseBrand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandInput((prev) => ({ ...prev, [name]: value }));
    setBrandValidation((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const brandValidation = validateBrand(brandInput);
    // Setting validation errors
    if (Object.keys(brandValidation).length > 0) {
      setBrandValidation(brandValidation);
      return;
    }

    try {
      const response = await editBrand({
        brandId,
        ...brandInput,
      }).unwrap();

      if (response.success) {
        toast.success(response.message, {
          duration: 1500,
        });
        setTimeout(() => navigate('/admin/brands'), 1500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg shadow-lg text-primary-text'>
      <CardHeader className='bg-primary-bg/10'>
        <CardTitle className='text-2xl font-bold text-center text-primary-text'>
          Edit Brand
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-6'>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          <InputField
            type='text'
            value={brandInput.name}
            onChange={handleChange}
            label='Brand Name'
            name='name'
            placeHolder='Enter brand name'
            isInvalid={!!brandValidation.name}
            errorMessage={brandValidation.name}
          />
          <div className='space-y-2'>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-primary-text'>
              Description
            </label>
            <Textarea
              id='description'
              name='description'
              value={brandInput.description}
              onChange={handleChange}
              placeholder='Enter brand description'
              className='w-full bg-[#262626] ring-0 focus:ring-2 text-primary-text rounded-md'
              rows={4}
            />
          </div>

          <Button
            type='submit'
            className='w-full bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2 rounded-md'>
            Confirm Edit
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
        ) : isEditBrandError ? (
          <Alert
            Icon={CircleX}
            variant='destructive'
            description={
              editBrandError?.data?.message ||
              'Something went wrong! Please try again.'
            }
          />
        ) : null}
      </CardContent>
    </Card>
  );
};
