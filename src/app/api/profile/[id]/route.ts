import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { RouteContext } from "../../../../../types/types";

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    // Await the params Promise
    const params = await context.params;
    const { id } = params;

    // Execute all queries in parallel for better performance
    const [user, posts, likedPosts] = await Promise.all([
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
          _count: {
            select: {
              likes: true,
              comments: true,
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
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    // Check if user exists (posts and likedPosts can be empty arrays)
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
