import { useState, useEffect } from 'react';

import { useDebounce } from 'use-debounce';
import { AxiosError } from 'axios';

import { Input } from '@/components/ui/input';
import AddFriend from '@/components/AddFriend';
import { getAvatarName } from '@/helper/helper';
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
  useEffect(() => {
    async function fetchFriends() {
      try {
        const { data } = await getFriends();
        if (data.success) {
          setFriends(data.friends)
        }
      } catch (err) {
        const axiosError = err as AxiosError<ApiResponse>;
        showError(axiosError.response?.data.message || "Error in fetching friends");
      }
    }
    fetchFriends();
  }, [showError])
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
            users && users.map((user) => <AddFriend key={user._id} imageUrl={user.avatar} imageFallback={getAvatarName(user.username)} username={user.username} email={user.email} />)
          }
        </div>
        <div className={`${collapse ? 'h-2/4 overflow-y-auto' : 'h-1/5 overflow-hidden'} transition-all duration-300 border-t`}>
          <h2 className='p-2 text-lg font-semibold cursor-pointer' onClick={() => setCollapse(!collapse)}>My Friends <i className={`ri-arrow-${collapse ? 'down' : 'up'}-s-line`}></i></h2>
          {
            friends && friends.map((friend) => {
              const friendId = friend.userId._id === user._id ? friend.friendId : friend.userId;
              return <AddFriend key={friend._id} imageUrl={friendId.avatar} imageFallback={getAvatarName(friendId.username)} username={friendId.username} email={friendId.email} isAdded={true} showUnfriendIcon={true} />
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Friends
