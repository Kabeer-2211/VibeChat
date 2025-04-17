import React, { createContext, useCallback, useEffect, useState } from 'react';

import { AxiosError } from 'axios';

import { ApiResponse, Friend, User } from '@/types/apiResponse';
import { useError } from '@/hooks/useError';
import { acceptFriendRequest, addFriend, deleteFriend, getFriendRequests, getFriends } from '@/services/friend';
import { getUsers } from '@/services/user';

export interface FriendContextType {
    friends: [Friend] | undefined;
    users: [User] | undefined;
    friendRequests: [Friend] | undefined;
    fetchFriends: () => void;
    searchUsers: (query: string) => void;
    getRequests: () => void;
    acceptRequest: (id: string) => void;
    declineRequest: (id: string) => void;
    handleAddFriendClick: (id: string, ref: React.RefObject<SVGSVGElement | null>) => void;
    handleUnFriendClick: (id: string) => void;
}

export const friendContext = createContext<FriendContextType | undefined>(undefined);

const FriendProvider = ({ children }: { children: React.ReactNode }) => {
    const [friends, setFriends] = useState<[Friend]>();
    const [users, setUsers] = useState<[User]>();
    const [friendRequests, setFriendRequests] = useState<[Friend] | undefined>();
    const { showError, showMessage } = useError();

    const fetchFriends = useCallback(async (): Promise<void> => {
        try {
            const { data } = await getFriends();
            if (data.success) {
                setFriends(data.friends)
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in fetching friends");
        }
    }, [showError]);

    const searchUsers = useCallback(async (query: string): Promise<void> => {
        try {
            console.log(query)
            if (query) {
                const { data } = await getUsers(query);
                if (data.success) {
                    setUsers(data.users)
                }
            } else {
                setUsers(undefined);
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in searching user");
        }
    }, [showError]);

    const getRequests = useCallback(async (): Promise<void> => {
        try {
            const { data } = await getFriendRequests();
            if (data.success) {
                setFriendRequests(data.friendRequests);
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in sending friend request");
        }
    }, [showError]);

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
                showMessage("User removed from friend list");
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in removing friend");
        }
    }, [showError, showMessage]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    useEffect(() => {
        getRequests();
    }, [getRequests]);

    return (
        <friendContext.Provider value={{ friends, users, friendRequests, fetchFriends, searchUsers, getRequests, acceptRequest, declineRequest, handleAddFriendClick, handleUnFriendClick }}>
            {children}
        </friendContext.Provider>
    )
}

export default FriendProvider