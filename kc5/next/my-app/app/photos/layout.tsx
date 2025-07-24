import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  viewer: ReactNode;
};
export default function PhotosLayout({ children, viewer }: Props) {
  return (
    <>
      <h1 className='text-2xl text-center'>Photo Gallery</h1>
      <h2>출처:</h2>
      <p>
        <a href='https://www.loom.com/share/2e0394c7d9f64c9e89f4d978abc72e91'>
          [LOOM]
        </a>
      </p>
      <div>
        <a href='https://github.com/indiflex/kc5/tree/develop/next/my-app/app/photos'>
          https://github.com/indiflex
        </a>
      </div>
      <div className='flex justify-center'>{children}</div>
      {viewer}
    </>
  );
}
