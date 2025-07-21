"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MouseEventHandler, use } from "react";
import Link from "next/link";

type Props = {
  params : Promise<{id : string}>
};

export default function ModalID({ params } : Props){
  const { id } = use(params);
  const router = useRouter();

  const onClickPrev :MouseEventHandler<HTMLButtonElement> = (evt) => {
    router.back();
  }

  return (
    <>
      <div className="fixed left-0 top-0 h-full w-full bg-zinc-950/80 ">
        <div className="absolute top-1/2 left-1/2 -translate-1/2">
          <Link href={`/photos/${id}`}>
            <Image
              src={`https://picsum.photos/id/${id}/200/300`}
              alt={'picsum photo'}
              width={200}
              height={300}
            />
          </Link>
          <button className='bg-amber-50 p-3' onClick={onClickPrev}>이전으로 돌아가기</button>
        </div>
      </div>
    </>
  )
}