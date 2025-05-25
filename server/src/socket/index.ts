import http from "http";

import { Server } from "socket.io";

import { auth } from "../socket/middleware/Auth";
import messageEvent from "../socket/events/message";

export function initSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(auth);

  io.on("connection", async (socket) => {
    // const user = socket.user;
    // user.isOnline = true;
    // await user.save();

    messageEvent(io, socket);

    socket.on("disconnect", async () => {
      // const user = socket.user;
      // user.isOnline = false;
      // await user.save();
    });
  });
}
