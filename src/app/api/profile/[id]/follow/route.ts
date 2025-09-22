import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { RouteContext } from "../../../../../../types/types";

export async function GET(req: NextRequest, context: RouteContext) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "You must log in to access this resource",
      status: 401,
    });
  }

  const userId = token.sub;
  // Await the params Promise
  const params = await context.params;
  const { id } = params;

  const follow = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId as string,
        followingId: id,
      },
    },
  });

  const isFollowing = !!follow;
  return NextResponse.json({ message: "Result found", isFollowing });
}

export async function POST(req: NextRequest, context: RouteContext) {
  // Await the params Promise
  const params = await context.params;
  const { id } = params;

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "You must log in to access this resource",
      status: 401,
    });
  }

  const userId = token.sub;

  // Fixed logic: user should NOT be able to follow themselves
  if (userId === id) {
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
    // Unfollow
    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: userId as string,
          followingId: id,
        },
      },
    });
    return NextResponse.json({
      message: "Unfollowed successfully",
      isFollowing: false,
    });
  }

  // Follow
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

  return NextResponse.json({
    message: "Following successfully",
    isFollowing: true,
  });
}
