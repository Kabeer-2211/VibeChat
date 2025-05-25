import { publisher } from ".";

export async function publish(channel: string, message: string) {
  if (publisher.status !== "ready") {
    publisher.connect();
  }
  publisher.publish(channel, message);
  publisher.disconnect();
}
