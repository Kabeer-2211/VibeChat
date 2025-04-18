import { UserPlus, X, RefreshCcw } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarName } from "@/helper/helper";
import { Button } from "@/components/ui/button";
import { useFriend } from "@/hooks/useFriends";
import { useAppSelector } from '@/hooks/redux';

const FriendRequest = () => {
    const { getRequests, acceptRequest, declineRequest } = useFriend();
    const friend = useAppSelector(state => state.friend);

    return (
        <>
            {friend.friendRequests && <div>
                <h1 className="p-3 pb-1 text-xl font-semibold flex items-center justify-between">
                    Friend Requests ({friend.friendRequests.length})
                    <RefreshCcw className="cursor-pointer" onClick={getRequests} />
                </h1>
                {friend.friendRequests.map(friend => <div key={friend._id} className='hover:bg-slate-100 p-3 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <Avatar className='w-12 h-12'>
                            <AvatarImage src={`${import.meta.env.VITE_BASE_URL}/avatars/${friend.userId.avatar}`} />
                            <AvatarFallback>{getAvatarName(friend.userId.username)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div>{friend.userId.username}</div>
                            <small>{friend.userId.email}</small>
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