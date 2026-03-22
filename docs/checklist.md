# Build Checklist

## Build Preferences

- **Git:** Commit after each checklist item with message: "Complete step N: [title]"
- **Verification:** Run dev server / Slack workspace and visually confirm each step works
- **Check-in cadence:** Balanced — enough discussion to learn, but keep moving

## Checklist

- [x] **1. Landing page scaffolding and all sections**
  Spec ref: `spec.md > Landing Page`
  What to build: Scaffold a React + Vite + TypeScript + Tailwind project in `standup-landing/`. Build all five components: Hero (tagline, description, placeholder "Add to Slack" CTA), HowItWorks (3-step visual breakdown: trigger, respond, summary), Testimonials (3 fictional dev quotes in card layout), FAQ (4-5 questions with accordion expand/collapse), and Footer (project name, hackathon credit). Assemble them in `App.tsx`. Dark mode throughout — dark grays (#0a0a0a / #1a1a1a), monospace headings, high-contrast text. Responsive layout.
  Acceptance: Single page loads with all five sections visible. Dark theme applied. "Add to Slack" button is present (links to #). FAQ accordion expands/collapses. Looks decent on mobile. Matches dev-tool aesthetic — no corporate SaaS vibes.
  Verify: Run `npm run dev`, open in browser. Scroll through all sections. Resize to mobile width and confirm layout stacks correctly.

- [x] **2. Bot project setup and TypeScript types**
  Spec ref: `spec.md > Bot Server > Types`, `spec.md > File Structure > Bot Server`
  What to build: Scaffold the `standup-bot/` project. Initialize with `npm init`, install dependencies (`@slack/bolt`, `@google/genai`, `typescript`, `ts-node`). Create `tsconfig.json`. Create `src/types.ts` with the `StandupSession` interface. Create `src/app.ts` with basic Bolt app initialization (reads tokens from `.env`). Create `.env` with placeholder values for `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `GEMINI_API_KEY`, `STANDUP_CHANNEL_ID`. Confirm the app starts without errors.
  Acceptance: `standup-bot/` folder exists with all files from the spec's file structure. TypeScript compiles without errors. Bolt app initializes and logs "Bot is running" to console.
  Verify: Run `npx ts-node src/app.ts` (with placeholder env vars) and confirm it starts without crashing. Check that `src/types.ts` has the `StandupSession` interface.

- [x] **3. Slash command handler with channel and duplicate checks**
  Spec ref: `spec.md > Bot Server > Slash Command Handler`
  What to build: Register the `/standup` slash command in `src/app.ts`. Implement channel check — if `command.channel_id` doesn't match `STANDUP_CHANNEL_ID`, respond with ephemeral message: "Head over to #standup to use this command." Implement duplicate check — if a session is already active, respond: "A standup is already in progress." On success, call `conversations.members` to get channel members, filter out bots, and respond with: "Standup started! DMs sent to X team members." Create the Slack app at api.slack.com/apps with required scopes (`commands`, `chat:write`, `im:write`, `im:read`, `im:history`, `channels:read`, `users:read`) and the `/standup` slash command.
  Acceptance: Typing `/standup` in `#standup` shows the confirmation message with correct member count. Typing `/standup` in any other channel shows the redirect message. Typing `/standup` twice shows the "already in progress" message.
  Verify: In test Slack workspace, run `/standup` in `#standup` — see confirmation. Run it in another channel — see redirect. Run it again in `#standup` — see duplicate warning.

- [ ] **4. DM sending to all channel members**
  Spec ref: `spec.md > Bot Server > Session Manager` (Starting a session)
  What to build: Implement `src/standup.ts` with a `startSession` function. When called, iterate over the member list and send each user a DM via `chat.postMessage` with the 3 standup questions. Initialize the session's `members` Map with each user set to `null`. If a DM fails, mark that user as `"unreachable"` in the map. Wire this into the slash command handler in `app.ts`.
  Acceptance: After `/standup`, every member in the `#standup` channel receives a DM from the bot with the 3 questions. The DM message matches the spec format (greeting, numbered questions, "reply in one message" instruction).
  Verify: Run `/standup` in test workspace. Check that each test account received the DM. Verify the message format looks correct.

- [ ] **5. Reply collection and acknowledgment**
  Spec ref: `spec.md > Bot Server > Session Manager` (Handling replies)
  What to build: Add a `message` event listener in `app.ts` for DM messages. When a reply comes from a user in the active session, store their reply text in the session map and send acknowledgment: "Got it, thanks! ✌️". If the user is not in an active session or has already replied, ignore silently. For now, skip the AI summarization — just log the reply to console.
  Acceptance: After receiving the DM questions, replying with free text triggers the "Got it, thanks! ✌️" acknowledgment. Replying a second time is ignored. The reply text is stored in the session map.
  Verify: Run `/standup`, reply to the bot DM from a test account. Confirm acknowledgment appears. Check console log shows the reply text. Reply again — confirm no second acknowledgment.

- [ ] **6. AI summarization and channel posting**
  Spec ref: `spec.md > Bot Server > AI Summarizer`, `spec.md > Bot Server > Session Manager` (Handling replies — post to channel)
  What to build: Implement `src/ai.ts` with the `summarizeReply` function using Gemini 2.5 Flash. The prompt asks for a single concise, casual, dev-friendly sentence covering yesterday/today/blockers. Wire it into the reply handler — after storing the reply and acknowledging, call `summarizeReply`, then post the one-liner to `#standup` as `@username: [AI summary]`. Add error handling: if Gemini fails, fall back to posting the raw reply text. Get a Gemini API key from Google AI Studio.
  Acceptance: When a team member replies to the bot DM, their AI-summarized one-liner appears in `#standup` within a few seconds. The summary is concise, casual, and captures yesterday/today/blockers. If AI fails, the raw reply is posted instead.
  Verify: Run `/standup`, reply from a test account with a multi-sentence standup update. Check `#standup` — a clean one-liner summary should appear with the user's name. Test the fallback by temporarily using an invalid API key — raw text should be posted instead.

- [ ] **7. Timeout handling and session cleanup**
  Spec ref: `spec.md > Bot Server > Session Manager` (Timeout)
  What to build: Start a `setTimeout` (30 seconds) when the session begins. When timeout fires: for each user with `null` in the map, post `@username: No response` to `#standup`. For each user marked `"unreachable"`, post `@username: Unreachable` to `#standup`. Set session `active = false` so a new `/standup` can be triggered. Make the timeout duration a constant that's easy to change. Ensure late replies after timeout are ignored.
  Acceptance: After 30 seconds, non-responders show as "No response" in `#standup`. Unreachable users show as "Unreachable". A new `/standup` can be triggered after timeout completes. Replies after timeout are ignored.
  Verify: Run `/standup` but don't reply from one test account. Wait 30 seconds — confirm "No response" appears in `#standup`. Try `/standup` again — confirm it works (no "already in progress"). Reply after timeout — confirm it's ignored.

- [ ] **8. Deploy bot to Leapcell and landing page to Vercel**
  Spec ref: `spec.md > Runtime & Deployment`
  What to build: Push `standup-bot/` to a Git repo and deploy to Leapcell. Configure build command (`npm install && npm run build`), start command (`node dist/app.js`), and environment variables in Leapcell dashboard. Update the Slack app's Request URL to the Leapcell domain. Push `standup-landing/` to a Git repo and deploy to Vercel. Verify both are live.
  Acceptance: Bot is running on Leapcell and responding to `/standup` in the test Slack workspace. Landing page is live on a `*.vercel.app` URL with all sections visible.
  Verify: Run `/standup` in Slack — full flow works (DMs, replies, AI summary, timeout) against the deployed bot. Open the Vercel URL in a browser — landing page loads correctly.

- [ ] **9. Prepare and record Devpost demo video**
  Spec ref: `spec.md > Demo Flow`, `prd.md > What We're Building`
  What to build: Script a 2-3 minute demo walkthrough. Structure: open with the problem (async standups, 10-15 sec), show `/standup` in action (trigger → DMs → reply → AI summary appearing in channel → timeout for non-responders), quick switch to landing page on Vercel. Record with clear audio and visible UI. Show the deployed versions — live Slack bot and live landing page.
  Acceptance: Video clearly shows the full standup flow working end to end. Problem statement is stated upfront. AI summary quality is visible. Landing page is shown. Audio is clear and narration is coherent. Under 5 minutes.
  Verify: Watch the recording end to end. Would a judge who knows nothing about StandupBot understand what it does and why it matters within the first 30 seconds?
