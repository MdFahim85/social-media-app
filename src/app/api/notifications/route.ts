import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json({
      message: "You must log in to access this resource",
      status: 401,
    });
  }
  const userId = token.sub;

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      post: {
        select: {
          id: true,
          content: true,
          image: true,
        },
      },
      comment: {
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!notifications.length) {
    return NextResponse.json({ message: "No notifications yet", status: 404 });
  }

  return NextResponse.json({
    message: "notifications found",
    status: 200,
    notifications,
  });
}
