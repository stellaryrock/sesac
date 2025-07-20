import Link from 'next/link';
import { PropsWithChildren } from 'react';

export default function HelloLayout({ children }: PropsWithChildren) {
  return (
    <>
      <nav className='flex justify-around space-x-3'>
        <Link href={'/hello/morning'}>morning</Link>
        <Link href={'/hello/afternoon'}>afternoon</Link>
        <Link href={'/hello/evening'}>evening</Link>
      </nav>

      {children}
    </>
  );
}
