import { Server, Socket } from "socket.io";

import MessageModel from "../../models/Message.model";
import { subscribe } from "../../redis/subscriber";
import { publish } from "../../redis/publisher";
export default async (io: Server, socket: Socket) => {
  subscribe("MESSAGE", async (data) => {
    const parsed = JSON.parse(data);

    if (parsed) {
      const roomLength =
        io.sockets.adapter.rooms.get(parsed.friendId)?.size || 0;
      await MessageModel.create({
        message: parsed.message,
        receiverId: parsed.receiverId,
        friendId: parsed.friendId,
        isSeen: roomLength === 2,
      });
    }
  });

  socket.on("joinRoom", (data) => {
    socket.join(data.chatId);
  });

  socket.on("leaveRoom", (data) => {
    socket.leave(data.chatId);
  });

  socket.on("sendMessage", async (data) => {
    await publish("MESSAGE", data);
    io.to(data.chatId).emit("newMessage", data);
  });
};
