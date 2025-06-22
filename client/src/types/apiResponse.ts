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

export interface Chat extends Document {
  _id: string;
  message: string;
  receiverId: User;
  userId: User;
  isSeen: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface Friend {
  _id: string;
  userId: User;
  friendId: User;
  chat: [Chat];
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
  messages?: [Chat];
}
