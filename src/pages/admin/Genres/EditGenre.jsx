import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';
import {
  useGetOneGenreQuery,
  useEditGenreMutation,
} from '@/redux/api/admin/genresApi';

import { Button } from '@/shadcn/components/ui/button';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InputField } from '@/components/common';
import { handleApiError, showToast, validateGenre } from '@/utils';

const initialGenreState = {
  name: '',
  description: '',
};

export const EditGenre = () => {
  const navigate = useNavigate();
  const { genreId } = useParams();

  // Fetching genre data
  const { data: responseGenre } = useGetOneGenreQuery(genreId);

  const [editGenre, { isLoading }] = useEditGenreMutation();

  // Genre state
  const [genreInput, setGenreInput] = useState(initialGenreState);
  const [genreValidation, setGenreValidation] = useState(initialGenreState);

  useEffect(() => {
    if (responseGenre) {
      setGenreInput({
        name: responseGenre.data.name,
        description: responseGenre.data.description,
      });
    }
  }, [responseGenre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGenreInput((prev) => ({ ...prev, [name]: value }));
    setGenreValidation((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const genreValidation = validateGenre(genreInput);
    // Setting validation errors
    if (Object.keys(genreValidation).length > 0) {
      setGenreValidation(genreValidation);
      return;
    }

    try {
      const response = await editGenre({
        genreId,
        ...genreInput,
      }).unwrap();

      if (response.success) {
        showToast.success(response.message);
        navigate('/admin/genres');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto bg-secondary-bg shadow-lg text-primary-text'>
      <CardHeader className='bg-primary-bg/10'>
        <CardTitle className='text-2xl font-bold text-center text-primary-text'>
          Edit Genre
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
            disabled={isLoading}
            className='w-full bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200 px-6 py-2 rounded-md'>
            Confirm Edit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
