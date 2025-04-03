import axios from "@/config/axios.ts";
import { ApiResponse } from "@/types/apiResponse.ts";

export const signup = async (data: FormData) =>
  await axios.post<ApiResponse>("/api/auth/v1/register", data);

export const login = async (data: { email: string; password: string }) =>
  await axios.post<ApiResponse>("/api/auth/v1/login", data);

export const verifyEmail = async (id: string, verifyCode: string) =>
  await axios.post<ApiResponse>(`/api/auth/v1/verify-email/${id}`, { verifyCode });

export const changePassword = async (data: {
  password: string;
  new_password: string;
}) => await axios.post(`/api/auth/v1/change-password`, data);

export const updateUserInfo = async (data: {
  username: string;
  bio: string;
  avatar: File;
}) => await axios.put(`/api/auth/v1/update-user-info`, data);

export const getUser = async () => await axios.get(`/api/auth/v1/user/profile`);
