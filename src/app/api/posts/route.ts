import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursorPage = searchParams.get("cursor");
  let cursor;
  if (cursorPage === "0") {
    cursor = null;
  } else {
    cursor = cursorPage;
  }
  const limit = 10;
  const posts = await prisma.post.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor } } : {}),
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
        where: { parentId: null },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
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
          commentLike: {
            select: {
              authorId: true,
            },
          },
          _count: {
            select: {
              commentLike: true,
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

  let nextCursor = null;
  if (posts.length > limit) {
    const nextPost = posts.pop();
    nextCursor = nextPost?.id;
  }

  return NextResponse.json({ posts, nextCursor });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { authorId, content, imageUrl } = body;
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
      ...(imageUrl.length && { images: imageUrl }),
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
      images: true,
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

  if (post.images.length > 0) {
    try {
      for (const url of post.images) {
        const parts = url.split("/");
        const fileWithExt = parts.pop() as string;
        const folder = parts.slice(parts.indexOf("upload") + 2).join("/");
        const publicId = `${folder}/${fileWithExt.split(".")[0]}`;
        const res = await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      return NextResponse.json({
        message: "Error deleting images",
        status: 500,
      });
    }
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
