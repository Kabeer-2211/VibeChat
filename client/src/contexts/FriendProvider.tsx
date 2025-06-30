import React, { createContext, useCallback, useEffect } from 'react';

import { AxiosError } from 'axios';

import { ApiResponse } from '@/types/apiResponse';
import { useError } from '@/hooks/useError';
import { acceptFriendRequest, addFriend, deleteFriend, getChatMessages, getFriendRequests, getFriends, markMessageAsRead } from '@/services/friend';
import { getUsers } from '@/services/user';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setFriends, setUsers, setFriendRequests } from '@/redux/slices/friendSlice';
import { setChatMessages, updateChat } from "@/redux/slices/chatSlice";
import { useSession } from '@/hooks/useSession';

export interface FriendContextType {
    fetchFriends: () => void;
    searchUsers: (query: string) => void;
    getRequests: () => void;
    acceptRequest: (id: string) => void;
    declineRequest: (id: string) => void;
    handleAddFriendClick: (id: string, ref: React.RefObject<SVGSVGElement | null>) => void;
    handleUnFriendClick: (id: string) => void;
    fetchMessages: (id: string) => void;
    updateMessageStatus: (id: string) => void;
}

export const friendContext = createContext<FriendContextType | undefined>(undefined);

const FriendProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { showError, showMessage } = useError();
    const { user, chat } = useAppSelector(state => state);
    const { socket } = useSession();

    const fetchFriends = useCallback(async (): Promise<void> => {
        try {
            const { data } = await getFriends();
            if (data.success) {
                dispatch(setFriends(data.friends))
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in fetching friends");
        }
    }, [dispatch, showError]);

    const searchUsers = useCallback(async (query: string): Promise<void> => {
        try {
            if (query) {
                const { data } = await getUsers(query);
                if (data.success) {
                    dispatch(setUsers(data.users));
                }
            } else {
                dispatch(setUsers(undefined));
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in searching user");
        }
    }, [dispatch, showError]);

    const getRequests = useCallback(async (): Promise<void> => {
        try {
            const { data } = await getFriendRequests();
            if (data.success) {
                dispatch(setFriendRequests(data.friendRequests));
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in sending friend request");
        }
    }, [dispatch, showError]);

    const acceptRequest = useCallback(async (id: string): Promise<void> => {
        try {
            const { data } = await acceptFriendRequest(id);
            if (data.success) {
                getRequests();
                fetchFriends();
                showMessage('Friend request accepted');
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in sending friend request");
        }
    }, [fetchFriends, getRequests, showError, showMessage]);

    const declineRequest = useCallback(async (id: string): Promise<void> => {
        try {
            const { data } = await deleteFriend(id);
            if (data.success) {
                getRequests();
                showMessage("Request declined");
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in sending friend request");
        }
    }, [getRequests, showError, showMessage]);

    const handleAddFriendClick = useCallback(async (id: string, ref: React.RefObject<SVGSVGElement | null>): Promise<void> => {
        try {
            const { data } = await addFriend(id);
            if (data.success) {
                ref.current?.remove();
                showMessage("Friend request sent!");
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in sending friend request");
        }
    }, [showError, showMessage]);

    const handleUnFriendClick = useCallback(async (id: string): Promise<void> => {
        try {
            const { data } = await deleteFriend(id);
            if (data.success) {
                fetchFriends();
                showMessage("User removed from friend list");
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in removing friend");
        }
    }, [fetchFriends, showError, showMessage]);

    const fetchMessages = useCallback(async (id: string): Promise<void> => {
        try {
            const { data } = await getChatMessages(id);
            if (data.success) {
                dispatch(setChatMessages(data.messages));
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in fetching messages");
        }
    }, [dispatch, showError]);

    const updateMessageStatus = useCallback(async (id: string): Promise<void> => {
        try {
            const { data } = await markMessageAsRead(id);
            if (data.success) {
                dispatch(updateChat(user._id));
                socket?.emit("messageUpdated", { chatId: chat.currentChat?._id });
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in marking message as read");
        }
    }, [dispatch, showError, user._id, socket, chat.currentChat?._id]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    useEffect(() => {
        getRequests();
    }, [getRequests]);

    return (
        <friendContext.Provider value={{ fetchFriends, searchUsers, getRequests, acceptRequest, declineRequest, handleAddFriendClick, handleUnFriendClick, fetchMessages, updateMessageStatus }}>
            {children}
        </friendContext.Provider>
    )
}

export default FriendProvider