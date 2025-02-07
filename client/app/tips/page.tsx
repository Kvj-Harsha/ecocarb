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
  }
];

export default function Page() {
  return (
    <div style={{ height: '700px', position: 'relative', color: 'white' }}>
      <InfiniteMenu items={items} />
    </div>
  );
}