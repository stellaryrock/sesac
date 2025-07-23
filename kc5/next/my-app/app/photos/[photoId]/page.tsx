import { getPhoto } from '@/app/actions/photo';
import Image from 'next/image';
import { use } from 'react';

type Props = {
  params: Promise<{ photoId: string }>;
};

export default function Photo({ params }: Props) {
  const { photoId } = use(params);
  const { download_url, author, width, height } = use(getPhoto(photoId));

  return (
    <>
      <div className='border-4 border-white'>
        <Image src={download_url} alt={author} width={width} height={height} />
      </div>

      <h2 className='text-lg bg-white/50 text-white text-center'>{author}</h2>
    </>
  );
}