import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { postId, content } = body;

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
  if (!content) {
    return NextResponse.json({ message: "Missing comment", status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    const newComment = await tx.comment.create({
      data: {
        postId: postId as string,
        authorId: userId as string,
        content,
      },
    });
    if (post.authorId !== userId) {
      await tx.notification.create({
        data: {
          type: "COMMENT",
          creatorId: userId as string,
          userId: post.authorId,
          postId,
          commentId: newComment.id,
        },
      });
    }
    if (!newComment) {
      return NextResponse.json({
        message: "Failed to post comment",
        status: 400,
      });
    }
    return newComment;
  });
  return NextResponse.json({
    message: "Comment added",
    status: 201,
  });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "Sign in to perform this action",
      status: 401,
    });
  }
  const userId = token?.sub;
  const { id } = body;
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
    select: {
      authorId: true,
    },
  });
  if (!comment) {
    return NextResponse.json({
      message: "No comment found",
      status: 404,
    });
  }
  if (comment.authorId !== userId) {
    return NextResponse.json({
      message: "You cannot delete this comment",
      status: 401,
    });
  }
  await prisma.comment.delete({
    where: {
      id,
    },
  });
  return NextResponse.json({
    message: "Comment deleted successfully",
    status: 200,
  });
}
