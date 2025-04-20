import "dotenv/config.js";
import http from "http";
import { ExtendedError, Server } from "socket.io";
import app from "./app";
import connect from "./db/db";
import UserModel from "./models/User.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import FriendModel from "./models/Friend.model";
import { Chat } from "./models/Friend.model";

async function startApp() {
  connect();
  await UserModel.collection.createIndex({ username: "text" });
  await UserModel.init();
  const server = http.createServer(app);
  const port = process.env.PORT || 3000;
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(" ")[1];
      if (!token) {
        return next(new Error("Authentication error"));
      }
      const decoded = (await jwt.verify(
        token,
        process.env.JWT_SECRET as string
      )) as JwtPayload;
      if (!decoded) {
        return next(new Error("Authentication error"));
      }
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return next(new Error("Authentication error"));
      }
      socket.user = user;
      next();
    } catch (err) {
      const error = err as ExtendedError;
      return next(error);
    }
  });

  io.on("connection", async (socket) => {
    const user = socket.user;
    user.isOnline = true;
    await user.save();

    socket.on("joinRoom", (data) => {
      socket.join(data.chatId);
    });

    socket.on("leaveRoom", (data) => {
      socket.leave(data.chatId);
    });

    socket.on("sendMessage", async (data) => {
      const friend = await FriendModel.findById(data.chatId);
      const roomLength = io.sockets.adapter.rooms.get(data.chatId)?.size || 0;
      const message = {
        message: data.message,
        receiverId: data.receiver,
        isSeen: roomLength === 2 ? true : false,
      } as Chat;
      friend?.chat.push(message);
      await friend?.save();
      await friend?.populate([{ path: "userId" }, { path: "friendId" }]);
      io.to(data.chatId).emit("newMessage", friend);
    });

    socket.on("disconnect", async () => {
      const user = socket.user;
      user.isOnline = false;
      await user.save();
    });
  });

  server.listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
}
startApp();
