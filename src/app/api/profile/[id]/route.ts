import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { RouteContext } from "../../../../../types/types";

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = params;

    const [user, posts, likedPosts, reposts] = await Promise.all([
      prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          followers: {
            select: {
              follower: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  _count: {
                    select: {
                      followers: true,
                    },
                  },
                },
              },
            },
          },
          following: {
            select: {
              following: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  _count: {
                    select: {
                      followers: true,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              followers: true,
              following: true,
              posts: true,
              reposts: true,
            },
          },
        },
      }),
      prisma.post.findMany({
        where: {
          authorId: id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
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
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.post.findMany({
        where: {
          likes: {
            some: {
              authorId: id,
            },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
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
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.repost.findMany({
        where: {
          authorId: id,
        },
        include: {
          post: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              comments: {
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
                orderBy: {
                  createdAt: "desc",
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
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          status: 404,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Resource found",
      user,
      posts: posts || [],
      likedPosts: likedPosts || [],
      reposts: reposts || [],
    });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        status: 500,
      },
      { status: 500 }
    );
  }
}
