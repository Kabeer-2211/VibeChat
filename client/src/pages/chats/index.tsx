import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarName } from "@/helper/helper";
import { setChat } from "@/redux/slices/chatSlice";

const ChatList = () => {
  const dispatch = useAppDispatch();
  const { friend, user } = useAppSelector((state) => state);
  return (
    <div>
      {friend.friends &&
        friend.friends.map((friend) => {
          const chat =
            user._id === friend.userId._id ? friend.friendId : friend.userId;
          return (
            <div
              key={friend._id}
              className="px-3 cursor-pointer hover:bg-slate-100"
              onClick={() => dispatch(setChat(friend))}
            >
              <div className="border-b py-3 flex items-center gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={`${import.meta.env.VITE_BASE_URL}/avatars/${
                      chat.avatar
                    }`}
                  />
                  <AvatarFallback>
                    {getAvatarName(chat.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h5 className="font-semibold">{chat.username}</h5>
                  <p>{chat.email}</p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ChatList;
