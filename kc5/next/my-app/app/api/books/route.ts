import { NextRequest, NextResponse } from 'next/server';
import { books } from './bookdata';

export const GET = (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q');
  const results = q ? books.filter(({ title }) => title.includes(q)) : books;

  return NextResponse.json(results);
};

export const POST = async (req: NextRequest) => {
  const { title, writer } = await req.json();

  const id = Math.max(...books.map(({ id }) => id), 0) + 1;
  const newer = { id, title, writer };
  books.push(newer);

  return Response.json(books);
};
