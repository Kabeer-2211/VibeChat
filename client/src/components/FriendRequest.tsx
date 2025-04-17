import { useState, useEffect, useCallback } from "react";

import { UserPlus, X, RefreshCcw } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarName } from "@/helper/helper";
import { deleteFriend, getFriendRequests } from "@/services/friend";
import { useError } from "@/hooks/useError";
import { AxiosError } from "axios";
import { ApiResponse, Friend } from "@/types/apiResponse";
import { Button } from "@/components/ui/button";
import { acceptFriendRequest } from "@/services/friend";

const FriendRequest = () => {
    const [friendRequests, setFriendRequests] = useState<[Friend] | undefined>();
    const { showError, showMessage } = useError();
    const getRequests = useCallback(async () => {
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
    const acceptRequest = useCallback(async (id: string) => {
        try {
            const { data } = await acceptFriendRequest(id);
            if (data.success) {
                getRequests();
                showMessage('Friend request accepted');
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in sending friend request");
        }
    }, [getRequests, showError, showMessage]);
    const declineRequest = useCallback(async (id: string) => {
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
    useEffect(() => {
        getRequests();
    }, [getRequests])
    return (
        <>
            {friendRequests && <div>
                <h1 className="p-3 pb-1 text-xl font-semibold flex items-center justify-between">
                    Friend Requests
                    <RefreshCcw className="cursor-pointer" onClick={getRequests} />
                </h1>
                {friendRequests.map(friend => <div key={friend._id} className='hover:bg-slate-100 p-3 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <Avatar className='w-12 h-12'>
                            <AvatarImage src={`${import.meta.env.VITE_BASE_URL}/avatars/${friend.friendId.avatar}`} />
                            <AvatarFallback>{getAvatarName(friend.friendId.username)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div>{friend.friendId.username}</div>
                            <small>{friend.friendId.email}</small>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant='destructive' className="cursor-pointer text-xs" onClick={() => declineRequest(friend.userId._id)}><X /></Button>
                        <Button className="cursor-pointer text-xs" onClick={() => acceptRequest(friend._id)}><UserPlus /></Button>
                    </div>
                </div>)}
            </div>}
        </>
    )
}

export default FriendRequest