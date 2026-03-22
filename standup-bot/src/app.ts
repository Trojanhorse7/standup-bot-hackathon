import "dotenv/config";
import { App, ExpressReceiver } from "@slack/bolt";
import type { StandupSession } from "./types";
import { sendStandupDMs } from "./standup";
import { summarizeReply } from "./ai";

const STANDUP_CHANNEL_ID = process.env.STANDUP_CHANNEL_ID!;
const STANDUP_TIMEOUT_MS = 30_000; // 30 seconds for demo — increase for production

const useSocketMode = Boolean(process.env.SLACK_APP_TOKEN);

// Use ExpressReceiver in HTTP mode for cloud deployment
const receiver = useSocketMode
  ? undefined
  : new ExpressReceiver({
      signingSecret: process.env.SLACK_SIGNING_SECRET!,
    });

// Add health check route for Leapcell
if (receiver) {
  receiver.router.get("/", (_req, res) => {
    res.send("StandupBot is running");
  });
  receiver.router.get("/kaithheathcheck", (_req, res) => {
    res.send("OK");
  });
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  ...(useSocketMode
    ? {
        socketMode: true,
        appToken: process.env.SLACK_APP_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET,
      }
    : { receiver: receiver! }),
});

let session: StandupSession | null = null;

app.command("/standup", async ({ command, ack, respond, client }) => {
  await ack();

  // Channel check
  if (command.channel_id !== STANDUP_CHANNEL_ID) {
    await respond("Head over to #standup to use this command.");
    return;
  }

  // Duplicate check
  if (session?.active) {
    await respond("A standup is already in progress.");
    return;
  }

  // Fetch channel members
  const result = await client.conversations.members({
    channel: STANDUP_CHANNEL_ID,
  });

  // Filter out bots — get user info for each member
  const memberIds = result.members ?? [];
  const humanMembers: string[] = [];

  for (const id of memberIds) {
    const userInfo = await client.users.info({ user: id });
    if (!userInfo.user?.is_bot) {
      humanMembers.push(id);
    }
  }

  // Create session
  const members = new Map<string, string | null | "unreachable">();
  for (const id of humanMembers) {
    members.set(id, null);
  }

  const timeoutId = setTimeout(async () => {
    if (!session?.active) return;

    console.log("Standup timeout — posting non-responses");

    for (const [userId, value] of session.members) {
      if (value === null || value === "unreachable") {
        const userInfo = await client.users.info({ user: userId });
        const displayName = userInfo.user?.real_name ?? userInfo.user?.name ?? userId;
        const status = value === "unreachable" ? "Unreachable" : "No response";

        await client.chat.postMessage({
          channel: STANDUP_CHANNEL_ID,
          text: `*${displayName}:* ${status}`,
        });
      }
    }

    session.active = false;
    console.log("Standup session ended");
  }, STANDUP_TIMEOUT_MS);

  session = {
    active: true,
    channelId: STANDUP_CHANNEL_ID,
    members,
    triggeredBy: command.user_id,
    startedAt: new Date(),
    timeoutId,
  };

  // Send DMs to all members
  await sendStandupDMs(client, session);

  await respond(`Standup started! DMs sent to ${humanMembers.length} team members.`);
  console.log(`Standup triggered by ${command.user_id} — ${humanMembers.length} members`);
});

// Listen for DM replies
app.message(async ({ message, say, client }) => {
  // Only handle direct messages with text
  if (message.channel_type !== "im" || message.subtype || !("text" in message)) {
    return;
  }

  // Ignore if no active session
  if (!session?.active) return;

  const userId = message.user;
  if (!userId) return;

  // Ignore if user isn't part of the standup
  if (!session.members.has(userId)) return;

  // Ignore if user already replied
  const currentValue = session.members.get(userId);
  if (currentValue !== null) return;

  // Store the reply
  const replyText = message.text ?? "";
  session.members.set(userId, replyText);
  console.log(`Reply from ${userId}: ${replyText}`);

  // Acknowledge
  await say("Got it, thanks! ✌️");

  // Summarize and post to #standup
  const summary = await summarizeReply(replyText);
  const userInfo = await client.users.info({ user: userId });
  const displayName = userInfo.user?.real_name ?? userInfo.user?.name ?? userId;

  await client.chat.postMessage({
    channel: STANDUP_CHANNEL_ID,
    text: `*${displayName}:* ${summary}`,
  });
});

(async () => {
  const port = Number(process.env.PORT) || 3000;
  await app.start(port);
  console.log(`⚡ StandupBot is running on port ${port}`);
})();

export { session, app, STANDUP_CHANNEL_ID };
