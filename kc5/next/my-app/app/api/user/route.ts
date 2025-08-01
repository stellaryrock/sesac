import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const POST = async (request: NextRequest) => {
  const { name, email } = await request.json();

  const user = await prisma.myUser.create({
    data: {
      name,
      email,
    },
  });

  return NextResponse.json(user);
};

export const PATCH = async (request: NextRequest ) => {
  const { id, name, email } = await request.json();

  const user = await prisma.myUser.update({
    where: {
      id: +id
    },
    data: {
      name,
      email
    }
  });

  return NextResponse.json(user);
}
