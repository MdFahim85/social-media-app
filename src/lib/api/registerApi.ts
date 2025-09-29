import API from "@/app/api/axios";

export async function registerUser(formData: FormData) {
  const res = await API.post(`/sign-up`, formData);
  if (res.data.status == 400 || res.data.status == 500) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}
