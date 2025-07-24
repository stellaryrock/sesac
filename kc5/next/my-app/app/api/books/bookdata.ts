export type Book = {
  id: number;
  title: string;
  writer: string;
};

export const books: Book[] = [
  {
    id: 1,
    title: 'Book1',
    writer: 'kim',
  },
  {
    id: 2,
    title: 'Book2',
    writer: 'hong',
  },
  {
    id: 3,
    title: 'Book3',
    writer: 'park',
  },
];
