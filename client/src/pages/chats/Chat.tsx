import { FormEvent, useCallback, useEffect, useState, useRef } from "react";

import { Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageBubble from "@/components/MessageBubble";
import { useAppSelector } from "@/hooks/redux";
import { getAvatarName } from "@/helper/helper";
import { useSession } from "@/hooks/useSession";
import { useAppDispatch } from "@/hooks/redux";
import { setChat } from "@/redux/slices/chatSlice";

const Chat = () => {
  const { socket } = useSession();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string>("");
  const { chat, user } = useAppSelector((state) => state);
  const previousChatId = useRef<string | null>(null);
  const friend =
    chat.currentChat?.userId._id === user._id
      ? chat.currentChat.friendId
      : chat.currentChat?.userId;

  useEffect(() => {
    if (socket && previousChatId.current) {
      socket.emit("leaveRoom", { chatId: previousChatId.current });
    }
    if (socket && chat.currentChat) {
      socket.emit("joinRoom", { chatId: chat.currentChat._id });
    }
    if (chat.currentChat) {
      previousChatId.current = chat.currentChat._id;
    }
    return () => {
      if (socket && chat.currentChat) {
        socket.emit("leaveRoom", { chatId: chat.currentChat._id });
      }
    };
  }, [socket, chat.currentChat]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (data) => {
        dispatch(setChat(data));
      });
    }
  }, [socket]);

  const handleSendMessage = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (message && socket && friend && chat.currentChat) {
        socket.emit("sendMessage", {
          message,
          receiver: friend._id,
          chatId: chat.currentChat._id,
        });
        setMessage("");
      }
    },
    [socket, message]
  );

  return (
    <div className="h-screen flex flex-col">
      <div className="p-3 border-b flex items-center gap-4 bg-slate-100">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={`${import.meta.env.VITE_BASE_URL}/avatars/${friend?.avatar}`}
          />
          <AvatarFallback>
            {getAvatarName(friend?.username || "")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h5 className="text-lg">{friend?.username}</h5>
          <p className="text-sm">{friend?.isOnline ? "online" : "offline"}</p>
        </div>
      </div>
      <div className="flex-grow flex flex-col">
        <div className="flex-grow max-h-[75vh] overflow-y-auto p-3">
          {chat.currentChat &&
            chat.currentChat.chat.map((item) => (
              <MessageBubble
                chat={item}
                friend={chat.currentChat}
                isFriend={item.receiverId !== user._id}
              />
            ))}
        </div>
        <form
          onSubmit={handleSendMessage}
          className="bg-slate-100 py-3 ps-5 pe-10 flex items-center"
        >
          <input
            type="text"
            placeholder="Type a message"
            className="outline-0 flex-grow bg-white p-3 rounded me-6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button>
            <Send className="cursor-pointer" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
