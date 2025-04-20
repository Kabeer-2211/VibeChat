import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface UserContextType {
  socket: Socket | null;
}
export const userContext = createContext<UserContextType | undefined>(undefined);
