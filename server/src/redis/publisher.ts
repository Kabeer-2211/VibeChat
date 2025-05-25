import { publisher } from ".";

export async function publish(channel: string, message: string) {
  if (publisher.status !== "ready") {
    await publisher.connect();
  }
  await publisher.publish(channel, message);
  publisher.disconnect();
}
