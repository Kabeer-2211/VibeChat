import { useState } from "react";

import ChatList from "./chats";
import Settings from "@/pages/settings";
import ProfileInfo from "@/pages/settings/ProfileInfo";
import Friends from "@/pages/friends/Friends";
import { getToken } from "@/utils/user";
import Sidebar from "@/components/Sidebar";
import Chat from "./chats/Chat";
import { useAppSelector } from "@/hooks/redux";

const Home = () => {
  const chat = useAppSelector((state) => state.chat);
  const [page, setPage] = useState<string>("chatList");
  const isAuthenticated = Boolean(getToken());

  return (
    <div className="h-full flex max-w-[1500px] mx-auto">
      {isAuthenticated && <Sidebar page={page} setPage={setPage} />}
      <div className="w-[40%] lg:w-[30%] h-screen overflow-y-auto hide-scroll bg-[#FDFDFD] border-r border-l">
        {page === "chatList" && <ChatList />}
        {page === "settings" && <Settings setPage={setPage} />}
        {page === "userProfile" && <ProfileInfo />}
        {page === "friends" && <Friends />}
      </div>
      <div className="w-[60%] lg:w-[70%] bg-white">
        {chat.currentChat && <Chat />}
      </div>
    </div>
  );
};

export default Home;
