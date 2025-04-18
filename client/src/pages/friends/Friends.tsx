import { useState, useEffect } from 'react';

import { useDebounce } from 'use-debounce';
import { RefreshCcw } from 'lucide-react';

import { Input } from '@/components/ui/input';
import AddFriend from '@/components/AddFriend';
import FriendRequest from '@/components/FriendRequest';
import { useError } from '@/hooks/useError';
import { useAppSelector } from '@/hooks/redux';
import { useFriend } from '@/hooks/useFriends';

const Friends = () => {
  const [query, setQuery] = useState<string>('');
  const [collapse, setCollapse] = useState<boolean>(false)
  const [debouncedQuery] = useDebounce(query, 700);
  const { showError } = useError();
  const { fetchFriends, searchUsers } = useFriend();
  const { user, friend } = useAppSelector(state => state);
  useEffect(() => {
    searchUsers(debouncedQuery);
  }, [debouncedQuery, searchUsers, showError]);

  return (
    <div className='flex flex-col h-full'>
      <Input className='rounded-none outline-0 shadow-0 border-0 border-b py-6' placeholder='Search by email or username' value={query} onChange={(e) => {
        setQuery(e.target.value)
      }} />
      <div className='flex-grow'>
        <div className={`${collapse ? 'h-2/4' : 'h-4/5'} overflow-y-auto transition-all duration-300`}>
          {debouncedQuery && <h5 className='p-2 text-lg'><span className='font-semibold'>Search Results For:</span> {debouncedQuery}</h5>}
          {
            friend.users && friend.users.length > 0 ? friend.users.map((user) => <AddFriend key={user._id} user={user} />) : <FriendRequest />
          }
        </div>
        <div className={`${collapse ? 'h-2/4 overflow-y-auto' : 'h-1/5 overflow-hidden'} transition-all duration-300 border-t`}>
          <div className='p-3 flex items-center justify-between'>
            <h2 className='text-lg font-semibold cursor-pointer' onClick={() => setCollapse(!collapse)}>My Friends <i className={`ri-arrow-${collapse ? 'down' : 'up'}-s-line`}></i></h2>
            <RefreshCcw className='cursor-pointer' onClick={fetchFriends} />
          </div>
          {
            friend.friends && friend.friends.length > 0 ? friend.friends.map((friend) => {
              const friendId = friend.userId._id === user._id ? friend.friendId : friend.userId;
              return <AddFriend key={friend._id} user={friendId} isAdded={true} showUnfriendIcon={true} />
            }) : <h1 className='text-center text-lg font-semibold mt-5'>No Friends Yet</h1>
          }
        </div>
      </div>
    </div>
  )
}

export default Friends
