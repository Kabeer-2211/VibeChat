import axios from "@/config/axios.ts";
import { ApiResponse } from "@/types/apiResponse.ts";

export const getFriends = async () => await axios.get<ApiResponse>("/api/friend/v1/get-friends");

export const getFriendRequests = async () => await axios.get<ApiResponse>("/api/friend/v1/get-friend-requests");

export const acceptFriendRequest = async (id: string) => await axios.put<ApiResponse>(`/api/friend/v1/accept-friend-request/${id}`);

export const addFriend = async (id: string) => await axios.post<ApiResponse>(`/api/friend/v1/add-friend-request/${id}`);

export const deleteFriend = async (id: string) => await axios.delete<ApiResponse>(`/api/friend/v1/delete-friend/${id}`);

export const getChatMessages = async (id: string) => await axios.get<ApiResponse>(`/api/friend/v1/get-chat-messages/${id}`);

export const markMessageAsRead = async (id: string) => await axios.put<ApiResponse>(`/api/friend/v1/mark-message-as-read/${id}`);

