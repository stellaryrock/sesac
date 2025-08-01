import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{id: string}>
}

export const GET = async (request: NextRequest, { params }: Props) => {
  const { id } = await params;

  const user = await prisma.myUser.findUnique({
    where: {
      id: +id
    }
  });

  return NextResponse.json(user);
}

export const DELETE = async (request: NextRequest, { params }: Props) => {
  const { id } = await params;

  const user = await prisma.myUser.delete({
    where:{
      id: +id
    }
  })

  return NextResponse.json(user);
}
