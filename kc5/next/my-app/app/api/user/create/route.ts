import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const POST = async (req: NextRequest) => {
  const { name, email } = await req.json();

  const user = await prisma.myUser.create({
    data: {
      name,
      email,
    },
  });

  return NextResponse.json(user);
};


/*
// response
{
  "id": 4,
  "name": "test",
  "email": "test@email.com",
  "createdate": "~",
  "updatedate": "~",
  "passwd": null
}
*/
