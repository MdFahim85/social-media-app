import axios from "axios";
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ROUTE,
});

export default API;
