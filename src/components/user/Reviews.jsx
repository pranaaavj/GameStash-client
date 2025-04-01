import { StarRating } from './StarRating';

export const Reviews = ({ reviews }) => (
  <div className='space-y-4'>
    {reviews.map((review, index) => (
      <div
        key={index}
        className='bg-secondary-bg p-4 rounded-lg'>
        <div className='flex justify-between items-center mb-2'>
          <span className='font-bold text-primary-text'>
            {review?.user?.name}
          </span>
          <StarRating rating={review?.rating} />
        </div>
        <p className='text-secondary-text'>{review?.comment}</p>
      </div>
    ))}
  </div>
);
