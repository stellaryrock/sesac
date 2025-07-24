import Modal from '@/components/Modal';
import Image from 'next/image';
import { getPhoto } from '@/lib/actions/photo';

type Props = {
  params: Promise<{ photoId: string }>;
};

export default async function PhotoInterceptor({ params }: Props) {
  const { photoId } = await params;
  const { download_url, author, width, height } = await getPhoto(photoId);

  return (
    <>
      <Modal>
        <div className='border-4 border-white'>
          <Image
            src={download_url}
            alt={author}
            width={width / 2}
            height={height / 2}
          />
        </div>

        <h2 className='text-lg bg-white/50 text-white text-center'>{author}</h2>
      </Modal>
    </>
  );
}
