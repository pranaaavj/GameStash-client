import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import {
  useGetAllBrandsQuery,
  useGetAllGenresQuery,
  useGetOneProductQuery,
  useEditProductMutation,
} from '@/redux/api/adminApi';
import { toast } from 'sonner';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { ImageUploader } from '@/components/admin/ImageUpload';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, InputField, SelectField } from '@/components/common';
import { validateProduct, mapOptionsData } from '@/utils';

const initialProductState = {
  name: '',
  price: '',
  genre: '',
  platform: '',
  images: [],
  brand: '',
  stock: '',
  description: '',
};

export const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  // Fetching brands and genres
  const {
    data: responseProduct,
    isError,
    error,
  } = useGetOneProductQuery(productId);
  const { data: responseBrands, isSuccess: brandQuerySuccess } =
    useGetAllBrandsQuery({});
  const { data: responseGenres, isSuccess: genreQuerySuccess } =
    useGetAllGenresQuery({});
  const [
    editProduct,
    { isError: isEditProductError, error: editProductError },
  ] = useEditProductMutation();

  // Product state
  const [images, setImages] = useState([]);
  const [productInput, setProductInput] = useState(initialProductState);
  const [productValidation, setProductValidation] =
    useState(initialProductState);

  useEffect(() => {
    if (responseProduct) {
      setProductInput({
        name: responseProduct.data.name,
        price: responseProduct.data.price,
        genre: responseProduct.data.genre.name,
        platform: responseProduct.data.platform,
        brand: responseProduct.data.brand.name,
        stock: responseProduct.data.stock,
        description: responseProduct.data.description,
      });
      setImages(responseProduct.data.images);
    }
  }, [responseProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInput((prev) => ({ ...prev, [name]: value }));
    setProductValidation((prev) => ({ ...prev, [name]: '' }));
  };

  // Mapping options from brands and genres
  const brandOptions = brandQuerySuccess
    ? mapOptionsData(responseBrands?.data?.brands)
    : [];
  const genreOptions = genreQuerySuccess
    ? mapOptionsData(responseGenres?.data?.genres)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productValidation = validateProduct(productInput);
    // Setting validation errors
    if (Object.keys(productValidation).length > 0) {
      setProductValidation(productValidation);
      return;
    }

    try {
      const response = await editProduct({
        productId,
        ...productInput,
        images,
      }).unwrap();

      if (response.success) {
        toast.success(response.message, {
          duration: 1500,
        });
        setTimeout(() => navigate('/admin/products'), 1500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg shadow-lg text-primary-text'>
      <CardHeader className='bg-primary-bg/10'>
        <CardTitle className='text-2xl font-bold text-center text-primary-text'>
          Edit Product
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
            helperText={!productValidation.price && 'Enter price in rupees'}
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
          <InputField
            type='text'
            value={productInput.platform}
            onChange={handleChange}
            label='Platform'
            name='platform'
            placeHolder='Enter platform'
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
              className='w-full bg-[#262626] ring-0 focus:ring-2 text-primary-text rounded-md'
              rows={4}
            />
          </div>

          <ImageUploader
            images={images}
            setImages={setImages}
          />

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
        ) : isEditProductError ? (
          <Alert
            Icon={CircleX}
            variant='destructive'
            description={
              editProductError?.data?.message ||
              'Something went wrong! Please try again.'
            }
          />
        ) : null}
      </CardContent>
    </Card>
  );
};
