import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { postId, postAuthorId } = await req.json();
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "Sign in to perform this action",
      status: 401,
    });
  }
  const authorId = token.sub as string;

  const existing = await prisma.repost.findUnique({
    where: {
      authorId_postId: { authorId, postId },
    },
  });

  if (existing) {
    await prisma.repost.delete({
      where: {
        id: existing.id,
      },
    });
    return NextResponse.json({
      message: "Repost removed successfully",
    });
  }

  const repost = await prisma.$transaction(async (tx) => {
    const newRepost = await tx.repost.create({
      data: {
        postId,
        authorId,
      },
    });
    if (postAuthorId !== authorId) {
      await tx.notification.create({
        data: {
          type: "REPOST",
          creatorId: authorId,
          userId: postAuthorId,
          postId,
        },
      });
    }
    return newRepost;
  });
  return NextResponse.json({
    message: "Reposted successfully",
    status: 201,
  });
}
