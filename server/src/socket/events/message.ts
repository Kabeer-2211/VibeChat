import { Server, Socket } from "socket.io";

import { messageProducer } from "../../services/producer";
import UserModel from "../../models/User.model";

export default async (io: Server, socket: Socket) => {

  socket.on("joinRoom", (data) => {
    socket.join(data.chatId);
  });

  socket.on("leaveRoom", (data) => {
    socket.leave(data.chatId);
  });

  socket.on("sendMessage", async (data) => {
    data.userId = socket.user.id;

    if (data) {
      const isSeen = io.sockets.adapter.rooms.get(data.chatId)?.size || 0;
      data.isSeen = isSeen === 2;
      const user = await UserModel.findById(data.userId).lean();
      const receiver = await UserModel.findById(data.receiverId).lean();

      const message = {
        ...data,
        userId: user,
        receiverId: receiver,
      };

      io.to(data.chatId).emit("newMessage", message);
      await messageProducer("CHAT", [{ value: JSON.stringify(data) }]);
    }
  });
};
