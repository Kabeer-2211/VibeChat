import { Partitioners } from "kafkajs";
import { kafka } from "../config/kafka";

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

export async function messageProducer(topic: string, messages: Array<any>) {
  await producer.connect();
  await producer.send({
    topic,
    messages: messages,
  });
  await producer.disconnect();
}
