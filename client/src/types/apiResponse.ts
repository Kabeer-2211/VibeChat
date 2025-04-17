export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  isOnline: boolean;
  createdAt: Date;
}
export interface Friend {
  _id: string;
  userId: User;
  friendId: User;
  status: string;
  createdAt: Date;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  users?: [User];
  friend?: Friend;
  friends?: [Friend];
  friendRequests?: [Friend];
}
