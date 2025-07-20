'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SearchParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const q = searchParams.get('q');

  const params = new URLSearchParams(searchParams.toString());

  return (
    <>
      <h3 className='text-2xl md-5'>Hello page {q}</h3>
      <div>Hello Page</div>

      <button
        onClick={() => {
          params.set('q', '000');
          router.push(`${pathname}?${params.toString()}`);
        }}
        className='border border-blue-200 rounded-md p-1 cursor-pointer text-blue-300 hover:text-blue-500'
      >
        setQ 000
      </button>
    </>
  );
}
