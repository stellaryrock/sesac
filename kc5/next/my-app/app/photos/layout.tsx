import { PropsWithChildren } from 'react';

type Props = {
  modal: React.ReactNode;
  photolist: React.ReactNode;
};

export default function ParalellLayout({
  photolist,
  modal,
  children,
}: PropsWithChildren<Props>) {
  return (
    <>
      <div className='my-2 border-2 border-amber-00'>{children}</div>
      <div>{photolist}</div>
      <div>{modal}</div>
    </>
  );
}
