import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { RouteContext } from "../../../../../types/types";

export async function GET(req: NextRequest, context: RouteContext) {
  const params = await context.params;
  const { id } = params;
  const post = await prisma.post.findUnique({
    where: { id },
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
  if (!post) {
    return NextResponse.json({ message: "No post found", status: 404 });
  }
  return NextResponse.json(post);
}
