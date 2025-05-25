import { Server, Socket } from "socket.io";

import { subscribe } from "../../redis/subscriber";
import { publish } from "../../redis/publisher";
import { messageProducer } from "../../services/producer";

export default async (io: Server, socket: Socket) => {
  subscribe("MESSAGE", async (data) => {
    const parsed = JSON.parse(data);
    io.to(parsed.chatId).emit("newMessage", parsed);

    if (parsed) {
      parsed.isSeen = io.sockets.adapter.rooms.get(parsed.friendId)?.size || 0;
      await messageProducer("MESSAGE", [{ value: JSON.stringify(parsed) }]);
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
  });
};
