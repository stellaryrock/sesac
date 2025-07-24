import { NextRequest, NextResponse } from 'next/server';
import { books } from '../bookdata';

type Params = {
  params: Promise<{ bookId: string }>;
};

export const GET = async (req: NextRequest, { params }: Params) => {
  const { bookId } = await params;
  const book = books.find((b) => b.id === +bookId);

  if (!book) return NextResponse.redirect('/api/books');

  return NextResponse.json(book);
};

export const PATCH = async (req: NextRequest, { params }: Params) => {
  const { bookId } = await params;
  const { title } = await req.json();

  const book = books.find((b) => b.id === +bookId);

  if (!book) throw new Error(`[PATCH /books/${bookId}] Not Found`);

  book.title = title;

  return Response.json(books);
};

export const DELETE = async (req: NextRequest, { params }: Params) => {
  const { bookId } = await params;
  const idx = books.findIndex((book) => book.id === +bookId);

  if (idx === -1) return Response.json({ code: 404, message: 'Not Found' });

  books.splice(idx, 1);

  return Response.json(books);
};
