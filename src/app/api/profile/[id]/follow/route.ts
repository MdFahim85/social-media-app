import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Params } from "../../../../../../types/types";

export async function GET(req: NextRequest, { params }: Params) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "You must log in to access this resource",
      status: 401,
    });
  }
  const userId = token.sub;
  const { id } = params;

  const follow = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId as string,
        followingId: id,
      },
    },
  });

  // if (!follow) {
  //   return NextResponse.json({ message: "Something went wrong", status: 404 });
  // }
  const isFollowing = !!follow;
  return NextResponse.json({ message: "Result found", isFollowing });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = params;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "You must log in to access this resource",
      status: 401,
    });
  }
  const userId = token.sub;

  if (userId !== id) {
    return NextResponse.json({
      message: "You cannot follow yourself",
      status: 403,
    });
  }
  const existingFollow = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId as string,
        followingId: id,
      },
    },
  });

  if (existingFollow) {
    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: userId as string,
          followingId: id,
        },
      },
    });
    return NextResponse.json({ message: "Success" });
  }
  await prisma.$transaction([
    prisma.follows.create({
      data: {
        followerId: userId as string,
        followingId: id,
      },
    }),
    prisma.notification.create({
      data: {
        type: "ID",
        userId: id,
        creatorId: userId as string,
      },
    }),
  ]);
  return NextResponse.json({ message: "Following" });
}
