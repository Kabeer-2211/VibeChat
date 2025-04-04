import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useAppSelector } from "@/hooks/redux";
import { getAvatarName } from '@/helper/helper';
import { LogOutIcon, KeyRound } from 'lucide-react';
import { deleteToken } from '@/utils/user';
import { useNavigate } from 'react-router-dom';

const Settings = ({ setPage }: { setPage: CallableFunction }) => {
    const user = useAppSelector(state => state.user);
    const navigate = useNavigate();
    return (
        <div>
            <button className='w-full flex items-center gap-5 p-5 hover:bg-slate-100 cursor-pointer' onClick={() => setPage('userProfile')}>
                <Avatar className="w-24 h-24 border rounded-full overflow-hidden">
                    <AvatarImage src={`${import.meta.env.VITE_BASE_URL}/avatars/${user?.avatar}`} />
                    <AvatarFallback className='bg-[#625EF1] text-white w-full h-full flex items-center justify-center text-2xl'>{getAvatarName(user?.username)}</AvatarFallback>
                </Avatar>
                <div className='text-start'>
                    <h4 className='text-lg font-semibold'>{user.username}</h4>
                    <p className='truncate'>{user.bio && user.bio?.length > 35 ? user.bio.substring(0, 35) + "..." : user.bio}</p>
                </div>
            </button>
            <div className='flex flex-col hover:bg-slate-100'>
                <button className='px-5 py-3 flex items-center gap-6 cursor-pointer' onClick={() => setPage('userProfile')}>
                    <KeyRound className='mb-2' />
                    <span className='text-xl flex-grow border-b text-start pb-3'>Change Password</span>
                </button>
            </div>
            <div className='flex flex-col hover:bg-slate-100'>
                <button className='px-5 py-3 flex items-center gap-6 text-red-600 cursor-pointer' onClick={() => {
                    deleteToken()
                    navigate('/login')
                }}>
                    <LogOutIcon className='mb-2' />
                    <span className='text-xl flex-grow border-b text-start pb-3'>Log out</span>
                </button>
            </div>
        </div>
    )
}

export default Settings