import { Carousel } from '@/shadcn/components/ui/carousel';
import { Card, CardContent, CardFooter } from '@/shadcn/components/ui/card';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
const featuredGames = [
  {
    id: 1,
    title: 'Cyberpunk 2077',
    image: 'http://placeholder.svg?height=400&width=600',
    price: '$59.99',
  },
  {
    id: 2,
    title: 'Elden Ring',
    image: 'http://placeholder.svg?height=400&width=600',
    price: '$59.99',
  },
  {
    id: 3,
    title: 'God of War',
    image: 'http://placeholder.svg?height=400&width=600',
    price: '$49.99',
  },
];

const allGames = [
  {
    id: 4,
    title: 'Red Dead Redemption 2',
    image: 'http://placeholder.svg?height=200&width=300',
    price: '$39.99',
  },
  {
    id: 5,
    title: 'The Witcher 3',
    image: 'https://placeholder.pics/svg/300x200',
    price: '$29.99',
  },
  {
    id: 6,
    title: 'Hades',
    image: 'https://placeholder.pics/svg/300x200',
    price: '$24.99',
  },
  {
    id: 7,
    title: 'Hollow Knight',
    image: 'https://placeholder.pics/svg/300x200',
    price: '$14.99',
  },
  {
    id: 8,
    title: 'Stardew Valley',
    image: 'https://placeholder.pics/svg/300x200',
    price: '$14.99',
  },
];

const genres = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Sports',
];

export const HomeUsers = () => {
  return (
    <div className='min-h-screen bg-primary-bg text-primary-text font-sans'>
      <main className='container mx-auto px-4 py-8'>
        <Carousel className='mb-12'>
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className='relative h-[400px]'>
              <img
                src={game.image}
                alt={game.title}
                className='w-full h-full object-cover'
              />
              <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-bg to-transparent p-6'>
                <h2 className='text-3xl font-poppins font-bold mb-2'>
                  {game.title}
                </h2>
                <p className='text-xl font-roboto mb-4'>{game.price}</p>
                <Button className='bg-accent-blue hover:bg-hover-blue text-primary-text'>
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </Carousel>

        <div className='flex flex-col md:flex-row gap-8'>
          <aside className='w-full md:w-1/4'>
            <h2 className='text-2xl font-poppins font-bold mb-4'>Filters</h2>
            <div className='space-y-4'>
              <Input
                placeholder='Search games'
                className='bg-secondary-bg text-primary-text'
              />
              <div>
                <h3 className='text-lg font-poppins font-semibold mb-2'>
                  Genres
                </h3>
                {genres.map((genre) => (
                  <div
                    key={genre}
                    className='flex items-center space-x-2 mb-2'>
                    <Checkbox id={genre} />
                    <label
                      htmlFor={genre}
                      className='text-secondary-text'>
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className='w-full md:w-3/4'>
            <h2 className='text-2xl font-poppins font-bold mb-6'>All Games</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {allGames.map((game) => (
                <Card
                  key={game.id}
                  className='bg-secondary-bg border-none'>
                  <CardContent className='p-0'>
                    <img
                      src={game.image}
                      alt={game.title}
                      className='w-full h-40 object-cover'
                    />
                  </CardContent>
                  <CardFooter className='flex justify-between items-center p-4'>
                    <div>
                      <h3 className='font-poppins font-semibold'>
                        {game.title}
                      </h3>
                      <p className='text-secondary-text'>{game.price}</p>
                    </div>
                    <Button className='bg-accent-green hover:bg-hover-green text-primary-bg'>
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className='bg-secondary-bg py-6 px-4 mt-12'>
        <div className='container mx-auto text-center text-secondary-text'>
          <p>&copy; 2024 GameStash. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
