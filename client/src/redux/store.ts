import { configureStore } from "@reduxjs/toolkit";

import userSliceReducer from "@/redux/slices/userSlice";
import friendSliceReducer from "@/redux/slices/friendSlice";

export const store = configureStore({
  reducer: {
    user: userSliceReducer,
    friend: friendSliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
