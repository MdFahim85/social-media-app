import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "Sign in to perform this action",
      status: 401,
    });
  }
  const userId = token.sub;
  const { authorId, commentId } = body;
  console.log(authorId, commentId);
  if (!authorId || !commentId) {
    return NextResponse.json({ message: "Error", status: 404 });
  }
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      authorId: true,
    },
  });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found", status: 404 });
  }

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      commentId_authorId: {
        authorId,
        commentId,
      },
    },
  });

  if (existingLike) {
    await prisma.commentLike.delete({
      where: {
        commentId_authorId: {
          authorId,
          commentId,
        },
      },
    });
    return NextResponse.json({ message: "Like removed" }, { status: 200 });
  }
  await prisma.$transaction([
    prisma.commentLike.create({
      data: {
        authorId: userId as string,
        commentId,
      },
    }),
  ]);

  return NextResponse.json({ message: "Liked comment", status: 201 });
}
