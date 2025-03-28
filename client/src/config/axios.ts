import axiosRaw from "axios";
import { getToken } from "@/utils/user.ts";

const axios = axiosRaw.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
