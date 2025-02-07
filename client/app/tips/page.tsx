import InfiniteMenu from '../components/InfiniteMenu';

const items = [
  {
    image: 'https://picsum.photos/300/300?grayscale',
    link: 'https://google.com/',
    title: 'Tip 1',
    description: 'Drive as if every drop of fuel counts—because it does.'
  },
  {
    image: 'https://picsum.photos/400/400?grayscale',
    link: 'https://google.com/',
    title: 'Tip 2',
    description: 'Saving fuel isn’t just about the car,it’s about the way you drive.'
  },

  {
    image: 'https://picsum.photos/600/600?grayscale',
    link: 'https://google.com/',
    title: 'Tip 3',
    description: 'Every gentle brake,every steady speed,is a step toward a greener future.'
  },

  {
    image: 'https://picsum.photos/600/600?grayscale',
    link: 'https://google.com/',
    title: 'Tip 4',
    description: 'Drive smooth, save fuel.'
  },

  {
    image: 'https://picsum.photos/600/600?grayscale',
    link: 'https://google.com/',
    title: 'Tip 5',
    description: 'Safe driving is smart driving.'
  },
  
  {
    image: 'https://picsum.photos/600/600?grayscale',
    link: 'https://google.com/',
    title: 'Tip 6',
    description: 'Brake less, coast more'
  },

  {
    image: 'https://picsum.photos/600/600?grayscale',
    link: 'https://google.com/',
    title: 'Tip 7',
    description: 'A well-tuned car runs cleaner'
  },

  {
    image: 'https://picsum.photos/600/600?grayscale',
    link: 'https://google.com/',
    title: 'Tip 8',
    description: 'Less speed, less fuel, less pollution.'
  },

  {
    image: 'https://picsum.photos/600/600?grayscale',
    link: 'https://google.com/',
    title: 'Tip 9',
    description: 'Fewer brakes, fewer emissions.'
  },

];

export default function Page() {
  return (
    <div style={{ height: '700px', position: 'relative', color: 'white' }}>
      <InfiniteMenu items={items} />
    </div>
  );
}