import { useState } from "react"

import Settings from "@/pages/settings";
import ProfileInfo from "@/pages/settings/ProfileInfo";
import Friends from "@/pages/friends/Friends";
import { getToken } from "@/utils/user";
import Sidebar from "@/components/Sidebar";

const Home = () => {
    const [page, setPage] = useState<string>("chats");
    const isAuthenticated = Boolean(getToken());

    return (
        <div className="h-full flex max-w-[1500px] mx-auto">
            {isAuthenticated && <Sidebar page={page} setPage={setPage} />}
            <div className="w-[40%] lg:w-[30%] h-screen overflow-y-auto hide-scroll bg-[#FDFDFD] border-r border-l">
                {page === 'settings' && <Settings setPage={setPage} />}
                {page === 'userProfile' && <ProfileInfo />}
                {page === 'friends' && <Friends />}
            </div>
            <div className="w-[60%] lg:w-[70%] bg-white">
            </div>
        </div>
    )
}

export default Home