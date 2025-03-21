import { EpicGamesCarousel } from './GameCarousal';

const FEATURED_GAMES = [
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    tagline: 'BEST SELLER',
    description:
      'Embark on an epic quest in the Lands Between. From the creators of Dark Souls.',
    price: 2999,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
  },
  {
    id: 'starfield',
    title: 'Starfield',
    tagline: 'EXPLORE THE STARS',
    description:
      'Bethesda’s next-gen RPG takes you to space. Explore planets, build ships, and unravel mysteries.',
    price: 3499,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg',
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg',
  },
  {
    id: 'the-witcher-3',
    title: 'The Witcher 3: Wild Hunt',
    tagline: 'ICONIC RPG',
    description:
      'An award-winning open-world RPG where you play as Geralt, a monster hunter, in a war-torn world.',
    price: 999,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
  },
  {
    id: 'hollow-knight-silksong',
    title: 'Hollow Knight: Silksong',
    tagline: 'COMING SOON',
    description:
      'A stunning sequel to Hollow Knight, featuring all-new combat, mechanics, and environments.',
    price: 2499,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1030300/header.jpg',
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1030300/header.jpg',
  },
  {
    id: 'valorant',
    title: 'Valorant',
    tagline: 'FREE TO PLAY',
    description:
      'A 5v5 tactical shooter by Riot Games. Choose your agent, strategize, and outplay opponents.',
    price: 0,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg', // Not on Steam, but placeholder image
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg',
  },
  {
    id: 'red-dead-redemption-2',
    title: 'Red Dead Redemption 2',
    tagline: 'AWARD-WINNING STORY',
    description:
      'Experience the life of an outlaw in this highly immersive open-world Western adventure.',
    price: 1999,
    image:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
    thumbnail:
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
  },
  
];

export function DemoCarousel() {
  const handleGameSelect = (game) => {
    console.log('Selected game:', game.title);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <EpicGamesCarousel
        games={FEATURED_GAMES}
        autoSwitchInterval={8000}
        onGameSelect={handleGameSelect}
      />
    </div>
  );
}
