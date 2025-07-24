import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { getPhotos } from '@/lib/actions/photo';

export default function Photos() {
  const photos = use(getPhotos());

  return (
    <>
      <div className='grid sm:grid-cols-3 gap-3 mx-auto md:grid-cols-5 lg:grid-cols-7'>
        {photos.map(({ id, author, download_url }) => (
          <Link key={id} href={`/photos/${id}`}>
            <Image src={download_url} alt={author} width={150} height={150} />
          </Link>
        ))}
      </div>
    </>
  );
}
