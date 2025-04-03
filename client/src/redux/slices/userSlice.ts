import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  email: string;
  avatar: string | undefined;
  bio: string | undefined;
  isLoading: boolean;
}

const initialState: UserState = {
  username: "",
  email: "",
  avatar: "",
  bio: "",
  isLoading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    beginAuthentication: (state): void => {
      state.isLoading = true;
    },
    AuthSuccess: (
      state,
      action: PayloadAction<{
        username: string;
        email: string;
        avatar?: string;
        bio?: string;
      }>
    ): void => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.bio = action.payload.bio;
      state.isLoading = false;
    },
    authFail: (state): void => {
      state.username = "";
      state.email = "";
      state.avatar = "";
      state.bio = "";
      state.isLoading = false;
    },
    authComplete: (state): void => {
      state.isLoading = false;
    },
  },
});

export const { beginAuthentication, AuthSuccess, authFail, authComplete } =
  userSlice.actions;

export default userSlice.reducer;
