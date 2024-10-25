import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/shadcn/components/ui/select';
import { Button } from '@/shadcn/components/ui/button';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { useState } from 'react';
import { InputField } from '@/components/common';
import { validateProduct } from '@/utils';

const initialProductState = {
  name: '',
  price: '',
  genre: '',
  platform: '',
  images: [],
  description: '',
  brand: '',
  stock: '',
};
export function AddProduct() {
  const [productInput, setProductInput] = useState(initialProductState);
  const [productValidation, setProductValidation] =
    useState(initialProductState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInput((prev) => ({ ...prev, [name]: value }));
    setProductValidation((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productValidation = validateProduct(productInput);
    // Setting validation errors
    if (Object.keys(productValidation).length > 0) {
      setProductValidation(productValidation);
      return;
    }

    console.log('Product submitted:', productInput);
  };

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg shadow-lg'>
      <CardHeader className='bg-primary-bg/10 border-b border-accent-blue'>
        <CardTitle className='text-2xl font-bold text-primary-text'>
          Add New Product
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-6'>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          <InputField
            type='text'
            value={productInput.name}
            onChange={handleChange}
            label='Product Name'
            name='name'
            placeHolder='Enter product name'
            isInvalid={!!productValidation.name}
            errorMessage={productValidation.name}
          />
          <InputField
            type='number'
            value={productInput.price}
            onChange={handleChange}
            label='Price'
            name='price'
            placeHolder='0.00'
            isInvalid={!!productValidation.price}
            errorMessage={productValidation.price}
            helperText='Enter price in USD'
          />
          <div className='space-y-2'>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-primary-text'>
              Category
            </label>
            <Select
              onValueChange={(value) =>
                handleChange({ target: { name: 'Genre', value } })
              }>
              <SelectTrigger className='w-full bg-primary-bg text-secondary-text border border-accent-blue rounded-md focus:ring-accent-blue'>
                <SelectValue placeholder='Select a Genre' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='games'>Games</SelectItem>
                <SelectItem value='consoles'>Consoles</SelectItem>
                <SelectItem value='accessories'>Accessories</SelectItem>
                <SelectItem value='merchandise'>Merchandise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <InputField
            type='text'
            value={productInput.brand}
            onChange={handleChange}
            label='Brand'
            name='brand'
            placeHolder='Enter brand name'
            isInvalid={!!productValidation.brand}
            errorMessage={productValidation.brand}
          />
          <InputField
            type='number'
            value={productInput.stock}
            onChange={handleChange}
            label='Stock'
            name='stock'
            placeHolder='Enter stock quantity'
            isInvalid={!!productValidation.stock}
            errorMessage={productValidation.stock}
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
              value={productInput.description}
              onChange={handleChange}
              placeholder='Enter product description'
              className='w-full bg-primary-bg text-secondary-text border border-accent-blue rounded-md focus:ring-accent-blue'
              rows={4}
            />
          </div>
          <Button
            type='submit'
            className='w-full bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2 rounded-md'>
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
