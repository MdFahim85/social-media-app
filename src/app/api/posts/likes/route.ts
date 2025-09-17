import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "Sign in to perform this action",
      status: 401,
    });
  }
  const userId = token.sub;
  const { authorId, postId } = body;
  console.log(authorId, postId);
  if (!authorId || !postId) {
    return NextResponse.json({ message: "Error", status: 404 });
  }
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      authorId: true,
    },
  });
  if (!post) {
    return NextResponse.json({ error: "Post not found", status: 404 });
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      authorId_postId: {
        authorId,
        postId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        authorId_postId: {
          authorId,
          postId,
        },
      },
    });
    return NextResponse.json({ message: "Like removed" }, { status: 200 });
  }
  await prisma.$transaction([
    prisma.like.create({
      data: {
        authorId,
        postId,
      },
    }),
    ...(post.authorId !== userId
      ? [
          prisma.notification.create({
            data: {
              type: "LIKE",
              userId: authorId as string,
              creatorId: userId as string,
            },
          }),
        ]
      : []),
  ]);

  return NextResponse.json({ message: "Liked post", status: 201 });
}
