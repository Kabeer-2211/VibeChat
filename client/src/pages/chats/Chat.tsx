import { FormEvent, useCallback, useEffect, useState, useRef } from "react";

import { Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageBubble from "@/components/MessageBubble";
import { useAppSelector } from "@/hooks/redux";
import { getAvatarName } from "@/helper/helper";
import { useSession } from "@/hooks/useSession";
import { useFriend } from "@/hooks/useFriends";
import { useAppDispatch } from "@/hooks/redux";
import { addMessage, updateChat } from "@/redux/slices/chatSlice";
import Indicator from "@/components/Indicator";

const Chat = () => {
  const { socket } = useSession();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState<string>("");
  const { chat, user } = useAppSelector((state) => state);
  const { fetchMessages, updateMessageStatus } = useFriend();
  const previousChatId = useRef<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

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
        dispatch(addMessage(data));
      });

      socket.on("messageUpdated", (data) => {
        if (chat.currentChat) {
          dispatch(updateChat(chat.currentChat?.friendId._id));
        }
      });

      socket.on("typing", (data) => {
        console.log(data, user._id);
        if (data.userId !== user._id) {
          setIsTyping(true);
        }
      });

      socket.on("stopTyping", (data) => {
        if (data.userId !== user._id) {
          setIsTyping(false);
        }
      });
    }
  }, [socket]);

  const handleSendMessage = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (message && socket && friend && chat.currentChat) {
        socket.emit("sendMessage", {
          message,
          receiverId: friend._id,
          chatId: chat.currentChat._id,
        });
        setMessage("");
      }
    },
    [socket, message]
  );

  useEffect(() => {
    if (chat.currentChat) {
      const id = chat.currentChat.userId._id === user._id
        ? chat.currentChat.friendId._id
        : chat.currentChat.userId._id;
      fetchMessages(id);
    }
  }, [chat.currentChat, fetchMessages]);

  useEffect(() => {
    if (chat.currentChat) {
      const id = chat.currentChat.userId._id === user._id
        ? chat.currentChat.friendId._id
        : chat.currentChat.userId._id;
      updateMessageStatus(id);
    }
  }, [chat.currentChat, updateMessageStatus]);

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
          {chat.chat &&
            chat.chat.map((item) => (
              <>
                <MessageBubble
                  key={item._id}
                  chat={item}
                  isFriend={item.userId._id !== user._id}
                />
              </>
            ))}
          {isTyping && <Indicator pfp={chat.currentChat?.userId._id === user._id ? chat.currentChat?.friendId.avatar : chat.currentChat?.userId.avatar || ""} />}
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
            onChange={(e) => {
              setMessage(e.target.value)
              socket?.emit("typing", {
                chatId: chat.currentChat?._id,
                userId: user._id,
              })
            }}
            onBlur={() => {
              socket?.emit("stopTyping", {
                chatId: chat.currentChat?._id,
                userId: user._id,
              })
            }}
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
