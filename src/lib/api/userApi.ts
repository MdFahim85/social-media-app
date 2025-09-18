import API from "@/app/api/axios";
import { COMMENT, LIKE } from "../../../types/postType";

export async function likeUnlike(like: LIKE) {
  const res = await API.post("/posts/likes", like);
  if (res.data.status == 401 || res.data.status == 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

export async function deletePost(id: any) {
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
