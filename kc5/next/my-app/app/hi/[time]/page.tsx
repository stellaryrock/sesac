import { use } from 'react';

type Props = {
  params: Promise<{ time: string }>;
};

export async function generateStaticParams() {
  return [
    {
      time: 'morning',
    },
    {
      time: 'afternoon',
    },
    {
      time: 'evening',
    },
    {
      time: 'night',
    },
  ];
}

export default function HiTime({ params }: Props) {
  const { time } = use(params);

  return (
    <>
      <h1 className='text-2xl capitalize'>good {time}</h1>
    </>
  );
}
