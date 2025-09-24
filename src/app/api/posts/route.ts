import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      likes: {
        select: {
          authorId: true,
        },
      },
      reposts: {
        select: {
          authorId: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          reposts: true,
        },
      },
    },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { authorId, content } = body;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "Sign in to perform this action",
      status: 401,
    });
  }
  const post = await prisma.post.create({
    data: {
      content,
      authorId,
    },
  });
  if (!post) {
    return NextResponse.json({ message: "Something went wrong", status: 400 });
  }
  return NextResponse.json({ post, message: "Post added" });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
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
      id,
    },
    select: {
      authorId: true,
    },
  });
  if (!post) {
    return NextResponse.json({ message: "No post found", status: 404 });
  }
  if (userId !== post.authorId) {
    return NextResponse.json({
      message: "You cannot delete this post",
      status: 401,
    });
  }
  await prisma.post.delete({
    where: {
      id,
    },
  });
  return NextResponse.json({
    message: "Post deleted successfully",
    status: 200,
  });
}
