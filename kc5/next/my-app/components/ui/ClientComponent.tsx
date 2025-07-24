'use client';

import { Folder } from '@/lib/folders';

type Props = {
  name: string;
  f: () => Promise<Folder[]>;
};

export default function ClientComponent({ name, f }: Props) {
  return (
    <>
      <h1 className='text-2xl'>Client Component: {name}</h1>
      <button
        onClick={async () => {
          const folders = await f();
          console.log(folders);
        }}
        className='btn'
      >
        BTS
      </button>
    </>
  );
}
