import API from "@/app/api/axios";
import { COMMENT, LIKE, POST } from "../../../types/types";

export async function likeUnlike(like: LIKE) {
  const res = await API.post("/posts/likes", like);
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

export const getPosts = async () => {
  try {
    const res = await API.get("/posts");
    return res.data;
  } catch (error) {
    console.log("error fetching posts");
  }
};

export async function addPost(post: POST) {
  try {
    const res = await API.post("/posts", post);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(id: string) {
  const res = await API.delete("/posts", { data: { id } });
  console.log(res);
  if (res.data.status == 401 || res.data.status == 404) {
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
  console.log(res);
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
    console.log("error fetching notifications");
  }
}

export async function readNotification(userId: string) {
  try {
    const res = await API.post("/notifications", { data: { userId } });
    return res;
  } catch (error) {
    console.log("Something went wrong");
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
