import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "vibe-chat",
  brokers: [":9092"],
});
