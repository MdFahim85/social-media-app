import { Prisma } from "@prisma/client";

const postQuery = {
  include: {
    author: { select: { name: true, image: true, email: true } },
    comments: {
      include: { author: { select: { id: true, name: true, image: true } } },
    },
    likes: { select: { authorId: true } },
    _count: { select: { likes: true, comments: true } },
  },
};

export type PostWithAllRelations = Prisma.PostGetPayload<typeof postQuery>;
