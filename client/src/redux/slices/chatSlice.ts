import { Friend } from "@/types/apiResponse";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface chatState {
  currentChat: Friend | undefined;
}

const initialState: chatState = {
  currentChat: undefined,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<Friend | undefined>): void => {
      state.currentChat = action.payload;
    },
  },
});

export const { setChat } = chatSlice.actions;

export default chatSlice.reducer;
