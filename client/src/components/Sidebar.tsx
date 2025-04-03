import Tooltip from '@/components/Tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector } from '@/hooks/redux';
import { getAvatarName } from '@/helper/helper';
import { Settings, MessageSquareMore } from 'lucide-react';

const Sidebar = ({ setPage, page }: { setPage: CallableFunction, page: string }) => {
    const user = useAppSelector(state => state.user);
    return (
        <header className='p-4 shadow-lg flex flex-col gap-10 bg-white'>
            <Avatar className="w-12 h-12 border">
                <AvatarImage src={`${import.meta.env.VITE_BASE_URL}/avatars/${user?.avatar}`} />
                <AvatarFallback className='bg-[#625EF1] text-white w-full h-full flex items-center justify-center text-2xl'>{getAvatarName(user?.username)}</AvatarFallback>
            </Avatar>
            <div className='flex justify-center flex-grow'>
                <Tooltip label='Chats'>
                    <MessageSquareMore className={`cursor-pointer ${page === 'chats' && 'text-[#625EF1]'}`} onClick={() => setPage('chats')} />
                </Tooltip>
            </div>
            <div className='flex justify-center'>
                <Tooltip label='Settings'>
                    <Settings className={`cursor-pointer ${page === 'settings' && 'text-[#625EF1]'}`} onClick={() => setPage('settings')} />
                </Tooltip>
            </div>
        </header>
    )
}

export default Sidebar