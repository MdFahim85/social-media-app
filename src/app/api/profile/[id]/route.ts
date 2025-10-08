import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { RouteContext } from "../../../../../types/types";
import { getToken } from "next-auth/jwt";
import cloudinary from "@/lib/cloudinary";
import streamifier from "streamifier";

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
          bio: true,
          location: true,
          banner: true,
          birthday: true,
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
    return NextResponse.json(
      {
        message: "Internal server error",
        status: 500,
        error,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  // Check authorization
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "Sign in to perform this action",
      status: 401,
    });
  }
  const id = token.sub;

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;
  const bannerFile = formData.get("banner") as File;
  const birthday = formData.get("birthday") as Date | null;
  let image = "";
  let banner = "";

  // Get user
  const user = await prisma.user.findUnique({
    where: { id },
  });

  // No user

  if (!user) {
    return NextResponse.json({ message: "User not found", status: 404 });
  }
  // Upload image
  if (imageFile) {
    const uploadPromise = async (image: File) => {
      const buffer = Buffer.from(await image.arrayBuffer());
      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "socialMediaApp",
            resource_type: "auto",
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result?.secure_url || "");
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };
    image = await uploadPromise(imageFile);
  }

  // Upload Banner
  if (bannerFile) {
    const uploadPromise = async (image: File) => {
      const buffer = Buffer.from(await image.arrayBuffer());
      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "socialMediaApp",
            resource_type: "auto",
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result?.secure_url || "");
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };
    banner = await uploadPromise(bannerFile);
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(image && { image }),
      ...(bio && { bio }),
      ...(banner && { banner }),
      ...(location && { location }),
      ...(birthday && { birthday }),
    },
  });

  // If unsuccessful

  if (!updatedUser) {
    return NextResponse.json({
      message: "There was an error while updating user data",
      status: 500,
    });
  }

  // On success

  return NextResponse.json({
    message: "User details updated successfully",
    status: 200,
    updatedUser,
  });
}
