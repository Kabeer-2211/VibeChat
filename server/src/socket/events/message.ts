import { Server, Socket } from "socket.io";

import { messageProducer } from "../../services/producer";

export default async (io: Server, socket: Socket) => {

  socket.on("joinRoom", (data) => {
    socket.join(data.chatId);
  });

  socket.on("leaveRoom", (data) => {
    socket.leave(data.chatId);
  });

  socket.on("sendMessage", async (data) => {
    data.userId = socket.user.id;
    io.to(data.chatId).emit("newMessage", data);

    if (data) {
      data.isSeen = io.sockets.adapter.rooms.get(data.chatId)?.size || 0;
      await messageProducer("CHAT", [{ value: JSON.stringify(data) }]);
    }
  });
};
