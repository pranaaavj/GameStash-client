import { Star } from 'lucide-react';

export const StarRating = ({ rating }) => (
  <div className='flex'>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          star <= rating
            ? 'fill-yellow-500 text-yellow-500'
            : 'fill-muted-text text-muted-text'
        }`}
      />
    ))}
  </div>
);
