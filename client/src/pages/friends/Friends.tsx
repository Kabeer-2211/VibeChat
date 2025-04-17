import { useState, useEffect, useCallback } from 'react';

import { useDebounce } from 'use-debounce';
import { AxiosError } from 'axios';
import { RefreshCcw } from 'lucide-react';

import { Input } from '@/components/ui/input';
import AddFriend from '@/components/AddFriend';
import FriendRequest from '@/components/FriendRequest';
import { getUsers } from '@/services/user';
import { useError } from '@/hooks/useError';
import { ApiResponse, Friend, User } from '@/types/apiResponse';
import { getFriends } from '@/services/friend';
import { useAppSelector } from '@/hooks/redux';

const Friends = () => {
  const [query, setQuery] = useState<string>('');
  const [users, setUsers] = useState<[User]>();
  const [friends, setFriends] = useState<[Friend]>()
  const [collapse, setCollapse] = useState<boolean>(false)
  const [debouncedQuery] = useDebounce(query, 700);
  const user = useAppSelector(state => state.user);
  const { showError } = useError();
  const fetchFriends = useCallback(async () => {
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
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends])
  useEffect(() => {
    async function searchUsers(): Promise<void> {
      try {
        const { data } = await getUsers(debouncedQuery.toString());
        if (data.success) {
          setUsers(data.users)
        }
      } catch (err) {
        const axiosError = err as AxiosError<ApiResponse>;
        showError(axiosError.response?.data.message || "Error in searching user");
      }
    }
    if (debouncedQuery) {
      searchUsers();
    } else {
      setUsers(undefined);
    }
  }, [debouncedQuery, showError])
  return (
    <div className='flex flex-col h-full'>
      <Input className='rounded-none outline-0 shadow-0 border-0 border-b py-6' placeholder='Search by email or username' value={query} onChange={(e) => {
        setQuery(e.target.value)
      }} />
      <div className='flex-grow'>
        <div className={`${collapse ? 'h-2/4' : 'h-4/5'} overflow-y-auto transition-all duration-300`}>
          {debouncedQuery && <h5 className='p-2 text-lg'><span className='font-semibold'>Search Results For:</span> {debouncedQuery}</h5>}
          {
            users && users.length > 0 ? users.map((user) => <AddFriend key={user._id} user={user} />) : <FriendRequest />
          }
        </div>
        <div className={`${collapse ? 'h-2/4 overflow-y-auto' : 'h-1/5 overflow-hidden'} transition-all duration-300 border-t`}>
          <div className='flex items-center justify-between'>
            <h2 className='p-2 text-lg font-semibold cursor-pointer' onClick={() => setCollapse(!collapse)}>My Friends <i className={`ri-arrow-${collapse ? 'down' : 'up'}-s-line`}></i></h2>
            <RefreshCcw className='cursor-pointer' onClick={fetchFriends} />
          </div>
          {
            friends && friends.length > 0 ? friends.map((friend) => {
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
