import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import { Button } from '@/shadcn/components/ui/button';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleApiError, showToast, validateBrand } from '@/utils';
import { InputField } from '@/components/common';
import { useAddBrandMutation } from '@/redux/api/admin/brandsApi';

const initialBrandState = {
  name: '',
  description: '',
};

export const AddBrand = () => {
  const navigate = useNavigate();
  const [addBrand, { isLoading }] = useAddBrandMutation();

  const [brandInput, setBrandInput] = useState(initialBrandState);
  const [brandValidation, setBrandValidation] = useState(initialBrandState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandInput((prev) => ({ ...prev, [name]: value }));
    setBrandValidation((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const brandValidation = validateBrand(brandInput);
    if (Object.keys(brandValidation).length > 0) {
      setBrandValidation(brandValidation);
      return;
    }

    try {
      const response = await addBrand(brandInput).unwrap();

      if (response.success) {
        showToast.success(response.message);
        navigate('/admin/brands');
      }
    } catch (error) {
      handleApiError(error, 'There was some error loading brands');
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg border-none text-primary-text'>
      <CardHeader className='bg-primary-bg/20 rounded-xl'>
        <CardTitle className='text-2xl font-bold text-center text-primary-text'>
          Add New Brand
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
            disabled={isLoading}
            className='w-full bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2 rounded-md'>
            {isLoading ? 'Adding...' : 'Add Brand'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
