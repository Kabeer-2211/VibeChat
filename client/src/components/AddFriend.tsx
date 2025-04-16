import { UserPlus, UserMinus } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AddFriend = ({ imageUrl, imageFallback = 'U', username, email, isAdded = false, showUnfriendIcon = false }: { imageUrl: string, imageFallback: string, username: string, email: string, isAdded?: boolean, showUnfriendIcon?: boolean }) => {
    return (
        <div className='hover:bg-slate-100 p-3 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <Avatar className='w-12 h-12'>
                    <AvatarImage src={`${import.meta.env.VITE_BASE_URL}/avatars/${imageUrl}`} />
                    <AvatarFallback>{imageFallback}</AvatarFallback>
                </Avatar>
                <div>
                    <div>{username}</div>
                    <small>{email}</small>
                </div>
            </div>
            <div>
                {!isAdded && <UserPlus className='hover:opacity-60 cursor-pointer' />}
                {isAdded && showUnfriendIcon && <UserMinus className='hover:opacity-60 cursor-pointer' />}
            </div>
        </div>
    )
}

export default AddFriend