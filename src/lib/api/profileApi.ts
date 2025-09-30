import API from "@/app/api/axios";
import { auth } from "@/auth";

export async function getProfileInfo(id: string) {
  const res = await API.get(`/profile/${id}`);

  if (res.data.status == 401 || res.data.status == 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

export async function getFollowInfo(id: string) {
  const res = await API.get(`/profile/${id}/follow`);
  if (res.data.status == 401 || res.data.status == 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

export async function followUser(id: string) {
  const res = await API.post(`/profile/${id}/follow`);
  if (
    res.data.status == 401 ||
    res.data.status == 404 ||
    res.data.status == 403
  ) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

export async function updateProfile(id: string, formData: FormData) {
  const res = await API.put(`/profile/${id}`, formData);
  if (
    res.data.status == 401 ||
    res.data.status == 404 ||
    res.data.status == 500
  ) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res.data;
}
