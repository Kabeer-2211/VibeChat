import { kafka } from "../config/kafka";
import MessageModel from "../models/Message.model";

const consumer = kafka.consumer({ groupId: "group-1" });

export async function messageConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "CHAT", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const msg = JSON.parse(message.value?.toString() || "{}");
      if (msg) {
        await MessageModel.create({
          message: msg.message,
          receiverId: msg.receiverId,
          userId: msg.userId,
          isSeen: msg.isSeen,
        });
      }
    },
  });
}
