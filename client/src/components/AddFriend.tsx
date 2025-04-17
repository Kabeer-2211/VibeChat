import { useRef } from 'react';

import { UserPlus, UserMinus } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types/apiResponse';
import { getAvatarName } from '@/helper/helper';
import { useFriend } from '@/hooks/useFriends';

const AddFriend = ({ user, isAdded = false, showUnfriendIcon = false }: { user: User, isAdded?: boolean, showUnfriendIcon?: boolean }) => {
    const { handleAddFriendClick, handleUnFriendClick } = useFriend();
    const friendIconRef = useRef<SVGSVGElement>(null);

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
                {!isAdded && <UserPlus ref={friendIconRef} className='hover:opacity-60 cursor-pointer' onClick={() => handleAddFriendClick(user._id, friendIconRef)} />}
                {isAdded && showUnfriendIcon && <UserMinus className='hover:opacity-60 cursor-pointer' onClick={() => handleUnFriendClick(user._id)} />}
            </div>
        </div>
    )
}

export default AddFriend