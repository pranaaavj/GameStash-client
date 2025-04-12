import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import { useAddProductMutation } from '@/redux/api/admin/productsApi';
import { useGetAllGenresQuery } from '@/redux/api/admin/genresApi';
import { useGetAllBrandsQuery } from '@/redux/api/admin/brandsApi';

import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUploader } from '@/components/admin';
import { Alert, InputField, SelectField } from '@/components/common';
import {
  validateProduct,
  mapOptionsData,
  validateImages,
  showToast,
  handleApiError,
} from '@/utils';
import {
  useUploadProductImageMutation,
  useDeleteProductImageMutation,
} from '@/redux/api/admin/productsApi';

const initialProductState = {
  name: '',
  price: '',
  genre: '',
  platform: '',
  brand: '',
  stock: '',
  description: '',
  systemRequirements: {
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
  },
};

export const AddProduct = () => {
  const navigate = useNavigate();

  // Fetching brands and genres
  const { data: responseBrands, isSuccess: brandQuerySuccess } =
    useGetAllBrandsQuery({});
  const { data: responseGenres, isSuccess: genreQuerySuccess } =
    useGetAllGenresQuery({});
  const [addProduct, { isError, error }] = useAddProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();

  // Product state
  const [images, setImages] = useState([]);
  const [imageValidation, setImageValidation] = useState('');
  const [productInput, setProductInput] = useState(initialProductState);
  const [productValidation, setProductValidation] =
    useState(initialProductState);

  useEffect(() => {
    setProductValidation(initialProductState);
    setImageValidation('');
  }, [productInput, images]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handling system requirements separately
    if (name in productInput.systemRequirements) {
      setProductInput((prev) => ({
        ...prev,
        systemRequirements: {
          ...prev.systemRequirements,
          [name]: value,
        },
      }));
    } else {
      setProductInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Mapping options from brands and genres
  const brandOptions = brandQuerySuccess
    ? mapOptionsData(responseBrands?.data?.brands)
    : [];
  const genreOptions = genreQuerySuccess
    ? mapOptionsData(responseGenres?.data?.genres)
    : [];

  const platformOptions = [
    { label: 'PC', value: 'PC' },
    { label: 'PlayStation', value: 'PlayStation' },
    { label: 'Xbox', value: 'Xbox' },
    { label: 'Nintendo', value: 'Nintendo' },
    { label: 'Other', value: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productValidation = validateProduct(productInput);
    const imageValidation = validateImages(images);

    if (Object.keys(productValidation).length > 0 || imageValidation) {
      setProductValidation(productValidation);
      setImageValidation(imageValidation);
      return;
    }

    try {
      const response = await addProduct({ ...productInput, images }).unwrap();

      if (response.success) {
        showToast.success(response.message);
        navigate('/admin/products');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleImagesChange = (images) => {
    setImages(images);
  };

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg shadow-lg text-primary-text'>
      <CardHeader className='bg-primary-bg/10'>
        <CardTitle className='text-2xl font-bold text-center text-primary-text'>
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
            type='text'
            value={productInput.price}
            onChange={handleChange}
            label='Price'
            name='price'
            placeHolder='0.00'
            isInvalid={!!productValidation.price}
            errorMessage={productValidation.price}
            helperText={!productValidation.price ? 'Enter price in rupees' : ''}
          />
          <SelectField
            type='text'
            value={productInput.genre}
            onChange={handleChange}
            label='Genre'
            name='genre'
            options={genreOptions}
            placeholder='Select a Genre'
            isInvalid={!!productValidation.genre}
            errorMessage={productValidation.genre}
          />
          <SelectField
            type='text'
            value={productInput.platform}
            onChange={handleChange}
            label='Platform'
            name='platform'
            options={platformOptions}
            placeholder='Select a platform'
            isInvalid={!!productValidation.platform}
            errorMessage={productValidation.platform}
          />
          <SelectField
            type='text'
            value={productInput.brand}
            onChange={handleChange}
            label='Brand'
            name='brand'
            options={brandOptions}
            placeholder='Select a brand'
            isInvalid={!!productValidation.brand}
            errorMessage={productValidation.brand}
          />
          <InputField
            type='text'
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
              className='w-full bg-[#262626] ring-0 focus:ring-2 text-primary-text rounded-md'
              rows={4}
            />
            {productValidation.description && (
              <span className='text-red-500 text-sm mt-0'>
                {productValidation.description}
              </span>
            )}
          </div>

          {/* System Requirements Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-primary-text'>
              System Requirements
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <InputField
                type='text'
                value={productInput.systemRequirements.cpu}
                onChange={handleChange}
                label='CPU'
                name='cpu'
                placeHolder='E.g., Intel i5, AMD Ryzen 5'
                isInvalid={!!productValidation.systemRequirements?.cpu}
                errorMessage={productValidation.systemRequirements?.cpu}
              />
              <InputField
                type='text'
                value={productInput.systemRequirements.gpu}
                onChange={handleChange}
                label='GPU'
                name='gpu'
                placeHolder='E.g., GTX 1060, Radeon RX 580'
                isInvalid={!!productValidation.systemRequirements?.gpu}
                errorMessage={productValidation.systemRequirements?.gpu}
              />
              <InputField
                type='text'
                value={productInput.systemRequirements.ram}
                onChange={handleChange}
                label='RAM'
                name='ram'
                placeHolder='E.g., 8GB, 16GB'
                isInvalid={!!productValidation.systemRequirements?.ram}
                errorMessage={productValidation.systemRequirements?.ram}
              />
              <InputField
                type='text'
                value={productInput.systemRequirements.storage}
                onChange={handleChange}
                label='Storage'
                name='storage'
                placeHolder='E.g., 50GB'
                isInvalid={!!productValidation.systemRequirements?.storage}
                errorMessage={productValidation.systemRequirements?.storage}
              />
            </div>
          </div>

          {/* Image Uploader */}
          <ImageUploader
            onImagesChange={handleImagesChange}
            uploadProductImage={uploadProductImage}
            deleteProductImage={deleteProductImage}
            initialImages={images}
          />

          {imageValidation && (
            <span className='text-red-500 text-sm mt-0'>{imageValidation}</span>
          )}

          <Button
            type='submit'
            className='w-full bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2 rounded-md'>
            Add Product
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
