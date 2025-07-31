import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  const { name, email } = await req.json();

  const user = prisma.myUser.create({
    data:{
      name,
      email
    }
  });

  return NextResponse.json(user);
}

// response
/*
{
  "spec": {
      "action": "create",
      "args": {
          "data": {
              "name": "Park",
              "email": "Park@email.com"
          }
      },
      "model": "MyUser"
  }
}
*/