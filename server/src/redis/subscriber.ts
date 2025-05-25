import { subscriber } from ".";

export async function subscribe(
  channel: string,
  action: (data: string) => void
): Promise<void> {
  await subscriber.subscribe(channel);
  subscriber.on("message", (channel, data) => {
    action(data);
  });
}
