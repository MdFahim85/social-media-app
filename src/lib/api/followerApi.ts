import API from "@/app/api/axios";

export async function getSuggestedUsers() {
  const res = await API.get(`/follows`);
  if (res.data.status == 401 || res.data.status == 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}
