import type { WebClient } from "@slack/web-api";
import type { StandupSession } from "./types";

const STANDUP_MESSAGE = `Hey! Time for standup 🧑‍💻

1. What did you do yesterday?
2. What are you working on today?
3. Any blockers?

Reply in one message — no formatting needed.`;

export async function sendStandupDMs(
  client: WebClient,
  session: StandupSession
): Promise<void> {
  for (const [userId] of session.members) {
    try {
      await client.chat.postMessage({
        channel: userId,
        text: STANDUP_MESSAGE,
      });
    } catch (error) {
      console.error(`Failed to DM user ${userId}:`, error);
      session.members.set(userId, "unreachable");
    }
  }
}
