import API from "@/app/api/axios";
import { COMMENT, LIKE, LIKECOMMENT, POST, REPLY } from "../../../types/types";

export async function likeUnlike(like: LIKE) {
  const res = await API.post("/posts/likes", like);
  if (res.data.status == 401 || res.data.status == 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

export async function toggleLikeComment(likeComment: LIKECOMMENT) {
  console.log(likeComment);
  const res = await API.post("/posts/comments/likes", likeComment);
  if (res.data.status == 401 || res.data.status == 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

export async function repostToggle({
  postId,
  postAuthorId,
}: {
  postId: string;
  postAuthorId: string;
}) {
  const res = await API.post("/repost", { postId, postAuthorId });
  if (res.data.status === 401) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res.data;
}

export const getPosts = async ({ pageParam }: { pageParam: number | null }) => {
  try {
    const res = await API.get("/posts?cursor=" + pageParam);
    return res.data;
  } catch (error) {
    console.log("error fetching posts", error);
  }
};

export const getSinglePost = async (id: string) => {
  const res = await API.get(`/posts/${id}`);
  if (res.data.status === 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res.data;
};

export const uploadImages = async (formData: FormData) => {
  const res = await API.post("/upload", formData);
  if (
    res.data.status === 401 ||
    res.data.status === 400 ||
    res.data.status === 500
  ) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
};

export async function addPost(post: POST) {
  const res = await API.post("/posts", post);
  if (
    res.data.status === 401 ||
    res.data.status === 400 ||
    res.data.status === 500
  ) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

export async function deletePost(id: string) {
  const res = await API.delete("/posts", { data: { id } });
  if (
    res.data.status == 401 ||
    res.data.status == 404 ||
    res.data.status == 500
  ) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

export async function addComment(comment: COMMENT) {
  const res = await API.post("/posts/comments", comment);
  console.log(res);
  if (res.data.status == 401 || res.data.status == 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

export async function deleteComment(id: string) {
  const res = await API.delete("/posts/comments", { data: { id } });
  if (res.data.status == 401 || res.data.status == 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

export async function addReply(reply: REPLY) {
  const res = await API.post("/posts/comments/reply", reply);
  if (res.data.status == 401 || res.data.status == 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

export async function getNotifications() {
  try {
    const res = await API.get("/notifications");
    return res;
  } catch (error) {
    console.log("error fetching notifications", error);
  }
}

export async function readNotification(userId: string) {
  try {
    const res = await API.post("/notifications", { data: { userId } });
    return res;
  } catch (error) {
    console.log("Something went wrong", error);
  }
}

export async function deleteNotification(id: string) {
  try {
    const res = await API.delete("/notifications", { data: { id } });
    return res;
  } catch (error) {
    console.log("Something went wrong");
    console.log(error);
  }
}
