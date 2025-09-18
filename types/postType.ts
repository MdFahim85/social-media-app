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

const notificationQuery = {
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
};

export type POST = {
  authorId: String | undefined; //user.id = authorId
  content: String;
};

export type LIKE = {
  authorId: String | undefined; //user.id = authorId
  postId: String;
};

export type COMMENT = {
  postId: String;
  content: String;
};

export type PostWithAllRelations = Prisma.PostGetPayload<typeof postQuery>;

export type Notifications = Prisma.NotificationGetPayload<
  typeof notificationQuery
>;
