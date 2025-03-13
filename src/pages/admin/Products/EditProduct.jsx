import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import {
  useGetOneProductQuery,
  useEditProductMutation,
} from '@/redux/api/admin/productsApi';
import { useGetAllGenresQuery } from '@/redux/api/admin/genresApi';
import { useGetAllBrandsQuery } from '@/redux/api/admin/brandsApi';
import { toast } from 'sonner';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { ImageUploader } from '@/components/admin/ImageUpload';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, InputField, SelectField } from '@/components/common';
import { validateProduct, mapOptionsData } from '@/utils';
import { Loading } from '@/components/error';

const initialProductState = {
  name: '',
  price: '',
  genre: '',
  platform: '',
  images: [],
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

export const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  // Fetching brands and genres
  const {
    data: responseProduct,
    isError,
    error,
    isLoading: isProductLoading,
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
    if (responseProduct && brandQuerySuccess && genreQuerySuccess) {
      setProductInput((prevInput) => ({
        ...prevInput,
        name: responseProduct.data.name,
        price: responseProduct.data.price,
        genre: responseProduct.data.genre._id,
        platform: responseProduct.data.platform,
        brand: responseProduct.data.brand._id,
        stock: responseProduct.data.stock,
        description: responseProduct.data.description,
        systemRequirements: responseProduct.data.systemRequirements || {
          cpu: '',
          gpu: '',
          ram: '',
          storage: '',
        },
      }));

      setImages(responseProduct.data.images);
    }
  }, [responseProduct, brandQuerySuccess, genreQuerySuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    setProductValidation((prev) => ({ ...prev, [name]: '' }));
  };

  const brandOptions = brandQuerySuccess
    ? mapOptionsData(responseBrands?.data?.brands)
    : [];
  const genreOptions = genreQuerySuccess
    ? mapOptionsData(responseGenres?.data?.genres)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productValidation = validateProduct(productInput);
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

      if (response?.success) {
        toast.success(response.message, {
          duration: 1500,
        });
        setTimeout(() => navigate('/admin/products'), 1500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!responseProduct || isProductLoading) {
    return <Loading />;
  }

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg shadow-none text-primary-text border-0'>
      <CardHeader className='bg-primary-bg/20 rounded-xl'>
        <CardTitle className='text-2xl shadow-none font-bold text-center text-primary-text'>
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
            type='text'
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
              className='w-full bg-[#262626] hover:border border-transparent text-primary-text rounded-md'
              rows={4}
            />
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
                placeHolder='E.g., GTX 1060, Radon RX 580'
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
