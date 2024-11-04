import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import { useAddGenreMutation } from '@/redux/api/admin/adminApi';
import { toast } from 'sonner';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, InputField } from '@/components/common';
import { validateGenre } from '@/utils';

const initialGenreState = {
  name: '',
  description: '',
};

export const AddGenre = () => {
  const navigate = useNavigate();
  const [addGenre, { isError, error }] = useAddGenreMutation();

  // Genre state
  const [genreInput, setGenreInput] = useState(initialGenreState);
  const [genreValidation, setGenreValidation] = useState(initialGenreState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGenreInput((prev) => ({ ...prev, [name]: value }));
    setGenreValidation((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const genreValidation = validateGenre(genreInput);
    if (Object.keys(genreValidation).length > 0) {
      setGenreValidation(genreValidation);
      return;
    }

    try {
      const response = await addGenre(genreInput).unwrap();

      if (response.success) {
        toast.success(response.message, {
          duration: 1500,
        });
        navigate('/admin/genres');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg shadow-lg text-primary-text'>
      <CardHeader className='bg-primary-bg/10'>
        <CardTitle className='text-2xl font-bold text-center text-primary-text'>
          Add New Genre
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-6'>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          <InputField
            type='text'
            value={genreInput.name}
            onChange={handleChange}
            label='Genre Name'
            name='name'
            placeHolder='Enter genre name'
            isInvalid={!!genreValidation.name}
            errorMessage={genreValidation.name}
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
              value={genreInput.description}
              onChange={handleChange}
              placeholder='Enter genre description'
              className='w-full bg-[#262626] ring-0 focus:ring-2 text-primary-text rounded-md'
              rows={4}
            />
          </div>

          <Button
            type='submit'
            className='w-full bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2 rounded-md'>
            Add Genre
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
