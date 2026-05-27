import axios from "axios";
import { getSession } from "next-auth/react";

const axiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

axiosAuth.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `user ${session.accessToken}`;
  }
  return config;
});

export default axiosAuth;
