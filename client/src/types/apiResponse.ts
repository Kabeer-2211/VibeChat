export interface User {
  username: string;
  email: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  isOnline: boolean;
  createdAt: Date;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}
