import socket, { Socket } from "socket.io-client";

import { getToken } from "@/utils/user";

export const initializeSocket = (): Socket => {
  const socketInstance = socket(import.meta.env.VITE_BASE_URL, {
    auth: {
      token: getToken(),
    },
  });
  return socketInstance;
};
