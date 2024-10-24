import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select';
import { Textarea } from '@/shadcn/components/ui/textarea';

// Assuming InputField is in the same directory
import { InputField } from '@/components/common';
import { Button } from '@/shadcn/components/ui/button';

export function AddProduct() {
  const [productInput, setProductInput] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    brand: '',
    stock: '',
  });

  const [productValidation, setProductValidation] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    brand: '',
    stock: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInput((prev) => ({ ...prev, [name]: value }));
    // Clear validation message when user starts typing
    setProductValidation((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form validation and submission logic here
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
                handleChange({ target: { name: 'category', value } })
              }>
              <SelectTrigger className='w-full bg-primary-bg text-secondary-text'>
                <SelectValue placeholder='Select a category' />
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
              className='w-full bg-primary-bg text-secondary-text'
              rows={4}
            />
          </div>
          <Button
            type='submit'
            className='w-full bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200'>
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
