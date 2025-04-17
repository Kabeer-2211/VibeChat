import { useContext } from "react";

import { friendContext, FriendContextType } from "@/contexts/FriendProvider";

export function useFriend(): FriendContextType {
    const context = useContext(friendContext);
    if (!context) {
        throw new Error('useFriend must be used within an FriendProvider');
    }
    return context;
}