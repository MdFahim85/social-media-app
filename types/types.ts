import { Prisma } from "@prisma/client";

export type RouteContext = {
  params: Promise<{ id: string }>;
};

const postQuery = {
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
        images: true,
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

const userQuery = {
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
};

const suggesterUsersQuery = {
  select: {
    id: true,
    name: true,
    email: true,
    image: true,
    _count: {
      select: {
        followers: true,
      },
    },
  },
};

export type USER = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  image: File | null;
};

export type POST = {
  authorId: string | undefined; //user.id = authorId
  content: string;
  imageUrl?: string[];
};

export type LIKE = {
  authorId: string | undefined; //user.id = authorId
  postId: string;
};

export type COMMENT = {
  postId: string;
  content: string;
};

export type FollowerType = {
  follower: {
    id: string;
    name: string;
    image: string;
    _count: {
      followers: number;
    };
  };
};

export type PostWithAllRelations = Prisma.PostGetPayload<typeof postQuery>;

export type Notifications = Prisma.NotificationGetPayload<
  typeof notificationQuery
>;

export type SuggestedUser = Prisma.UserGetPayload<typeof suggesterUsersQuery>;
export type User = Prisma.UserGetPayload<typeof userQuery>;
