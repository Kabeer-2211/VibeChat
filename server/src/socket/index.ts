import http from "http";

import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import { auth } from "../socket/middleware/Auth";
import messageEvent from "../socket/events/message";
import { publisher, subscriber } from "../redis";
import { client } from "../config/redis";

export function initSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.adapter(createAdapter(publisher, subscriber));

  io.adapter(createAdapter(publisher, subscriber));

  io.use(auth);

  io.on("connection", async (socket) => {
    const userId = socket.user.id;
    const socketKey = `user_sockets:${userId}`;

    await client.sadd(socketKey, socket.id);
    const totalSockets = await client.scard(socketKey);

    if (totalSockets === 1) {
      await client.sadd("users:online", userId);
      io.emit("userOnline", userId);
    }

    messageEvent(io, socket);

    socket.on("disconnect", async () => {
      await client.srem(socketKey, socket.id);
      const remaining = await client.scard(socketKey);

      if (remaining === 0) {
        await client.srem("users:online", userId);
        io.emit("userOffline", userId);
      }
    });
  });
}
