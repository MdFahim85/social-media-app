import { prisma } from "@/prisma";

export async function getUser(userId: string | undefined) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}
