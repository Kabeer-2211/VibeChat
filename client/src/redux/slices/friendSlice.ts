import { Friend, User } from "@/types/apiResponse";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface friendState {
  friends: [Friend] | undefined;
  users: [User] | undefined;
  friendRequests: [Friend] | undefined;
}

const initialState: friendState = {
  friends: undefined,
  users: undefined,
  friendRequests: undefined,
};

export const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setFriends: (
      state,
      action: PayloadAction<[Friend] | undefined>
    ): void => {
      state.friends = action.payload;
    },
    setUsers: (
      state,
      action: PayloadAction<[User] | undefined>
    ): void => {
      state.users = action.payload;
    },
    setFriendRequests: (
      state,
      action: PayloadAction<[Friend] | undefined>
    ): void => {
      state.friendRequests = action.payload;
    },
  }
});

export const { setFriends, setUsers, setFriendRequests } =
  friendSlice.actions;

export default friendSlice.reducer;
