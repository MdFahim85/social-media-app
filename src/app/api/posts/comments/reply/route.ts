import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { postId, replyContent, parentId } = body;

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "Sign in to perform this action",
      status: 401,
    });
  }
  const userId = token.sub;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      authorId: true,
    },
  });
  if (!post) {
    return NextResponse.json({ message: "No post found", status: 404 });
  }
  if (!replyContent) {
    return NextResponse.json({ message: "Missing comment reply", status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    const newReply = await tx.comment.create({
      data: {
        postId: postId as string,
        authorId: userId as string,
        content: replyContent,
        parentId,
      },
    });
    if (!newReply) {
      return NextResponse.json({
        message: "Failed to post comment",
        status: 400,
      });
    }
    return newReply;
  });
  return NextResponse.json({
    message: "Comment added",
    status: 201,
  });
}
