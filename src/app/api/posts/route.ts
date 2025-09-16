import { prisma } from "@/prisma";
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
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { authorId, content } = body;
  const post = await prisma.post.create({
    data: {
      content,
      authorId,
    },
  });
  return NextResponse.json({ post, message: "nice" });
}
