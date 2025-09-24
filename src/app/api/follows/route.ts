import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "Sign in to perform this action",
      status: 401,
    });
  }
  const userId = token.sub;

  const suggestedUsers = await prisma.user.findMany({
    where: {
      AND: [
        { NOT: { id: userId } },
        { NOT: { followers: { some: { followerId: userId } } } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      _count: {
        select: {
          followers: true,
        },
      },
    },
    take: 5,
  });

  return NextResponse.json({
    message: "Found suggestions",
    suggestedUsers,
  });
}
