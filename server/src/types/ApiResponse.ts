import { User } from "../models/User.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User
}
