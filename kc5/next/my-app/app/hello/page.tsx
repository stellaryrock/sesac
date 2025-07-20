import { Suspense } from 'react';
import SearchParams from './SearchParams';

export default function Hello() {
  return (
    <>
      <Suspense>
        <SearchParams />
      </Suspense>
    </>
  );
}
