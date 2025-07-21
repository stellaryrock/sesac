'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEventHandler, use } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function ModalID({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const onClickPrev: MouseEventHandler<HTMLButtonElement> = () => router.back();


  return (
    <>
      <div className='fixed left-0 top-0 h-full w-full bg-zinc-950/80 '>
        <div className='absolute top-1/2 left-1/2 -translate-1/2'>
          <Link href={`/photos/${id}`}>
            <Image
              src={`https://picsum.photos/id/${id}/200/300`}
              alt={'picsum photo'}
              width={200}
              height={300}
            />
          </Link>
          <button className='btn btn-primary' onClick={onClickPrev}>
            이전으로 돌아가기
          </button>
        </div>
      </div>
    </>
  );
}
