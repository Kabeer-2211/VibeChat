import { useCallback, useRef } from 'react';

import { UserPlus, UserMinus } from 'lucide-react';
import { AxiosError } from 'axios';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { addFriend, deleteFriend } from '@/services/friend';
import { ApiResponse, User } from '@/types/apiResponse';
import { getAvatarName } from '@/helper/helper';
import { useError } from '@/hooks/useError';

const AddFriend = ({ user, isAdded = false, showUnfriendIcon = false }: { user: User, isAdded?: boolean, showUnfriendIcon?: boolean }) => {
    const { showError, showMessage } = useError();
    const friendIconRef = useRef<SVGSVGElement>(null);
    const handleAddFriendClick = useCallback(async (id: string) => {
        try {
            const { data } = await addFriend(id);
            if (data.success) {
                friendIconRef.current?.remove();
                showMessage("Friend request sent!");
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            showError(axiosError.response?.data.message || "Error in sending friend request");
        }
    }, [showError, showMessage]);
    const handleUnFriendClick = useCallback(async (id: string) => {
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
    return (
        <div className='hover:bg-slate-100 p-3 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <Avatar className='w-12 h-12'>
                    <AvatarImage src={`${import.meta.env.VITE_BASE_URL}/avatars/${user.avatar}`} />
                    <AvatarFallback>{getAvatarName(user.username)}</AvatarFallback>
                </Avatar>
                <div>
                    <div>{user.username}</div>
                    <small>{user.email}</small>
                </div>
            </div>
            <div>
                {!isAdded && <UserPlus ref={friendIconRef} className='hover:opacity-60 cursor-pointer' onClick={() => handleAddFriendClick(user._id)} />}
                {isAdded && showUnfriendIcon && <UserMinus className='hover:opacity-60 cursor-pointer' onClick={() => handleUnFriendClick(user._id)} />}
            </div>
        </div>
    )
}

export default AddFriend