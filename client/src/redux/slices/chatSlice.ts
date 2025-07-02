import { Chat, Friend } from "@/types/apiResponse";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface chatState {
  currentChat: Friend | undefined;
  chat: Chat[] | undefined;
}

const initialState: chatState = {
  currentChat: undefined,
  chat: undefined,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<Friend | undefined>): void => {
      state.currentChat = action.payload;
    },
    setChatMessages: (state, action: PayloadAction<Chat[] | undefined>): void => {
      state.chat = action.payload;
    },
    addMessage: (state, action: PayloadAction<Chat | undefined>) => {
      state.chat?.push(action.payload);
    },
    updateChat: (state, action: PayloadAction<string>) => {
      state.chat = state.chat?.map(chat => {
        if (chat.receiverId._id !== action.payload) {
          chat.isSeen = true;
        }
        return chat;
      })
    }
  },
});

export const { setChat, setChatMessages, addMessage, updateChat } = chatSlice.actions;

export default chatSlice.reducer;
