# StandupBot — Technical Spec

## Stack

### Bot Server
- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Bolt for JavaScript (Slack SDK) — [Docs](https://docs.slack.dev/tools/bolt-js/) | [TypeScript guide](https://docs.slack.dev/tools/bolt-js/tutorial/using-typescript) | [Starter template](https://github.com/slack-samples/bolt-ts-starter-template)
- **AI:** Google Gemini API via `@google/genai` — [Docs](https://ai.google.dev/gemini-api/docs/quickstart) | [npm](https://www.npmjs.com/package/@google/genai)
- **Rationale:** Learner is strong in Node.js/TypeScript. Bolt is Slack's official framework with first-class TypeScript support. Gemini is free tier with generous rate limits.

### Landing Page
- **Language:** TypeScript
- **Framework:** React + Vite — [Docs](https://vite.dev/guide/)
- **Styling:** Tailwind CSS — [Docs](https://tailwindcss.com/docs)
- **Rationale:** Learner's preferred stack. Vite for fast dev server. Tailwind for rapid dark-mode styling without writing custom CSS.

## Runtime & Deployment

### Bot Server
- **Runs:** Long-running Node.js process on Leapcell — [Docs](https://docs.leapcell.io/examples/nodejs/express/)
- **Domain:** Auto-generated `*.leapcell.dev` URL (used as Slack app's Request URL)
- **Environment variables:**
  - `SLACK_BOT_TOKEN` — Bot User OAuth Token from Slack app settings
  - `SLACK_SIGNING_SECRET` — Signing secret from Slack app settings
  - `GEMINI_API_KEY` — API key from [Google AI Studio](https://aistudio.google.com/apikey)
  - `STANDUP_CHANNEL_ID` — Channel ID of `#standup` (right-click channel > Copy link > extract ID)

### Landing Page
- **Runs:** Static site on Vercel — [Docs](https://vercel.com/docs)
- **Domain:** Auto-generated `*.vercel.app` URL
- **No environment variables needed** — purely static content

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                     SLACK WORKSPACE                       │
│                                                          │
│  #standup channel              DMs                       │
│  ┌─────────────┐              ┌──────────────┐           │
│  │ /standup    │              │ Bot → User   │           │
│  │ cmd fires  │──┐           │ 3 questions  │           │
│  │            │  │           │              │           │
│  │ Summaries  │  │           │ User → Bot   │           │
│  │ posted     │◀─┼───────┐  │ free-text    │           │
│  │ per-person │  │       │  │ reply        │           │
│  └─────────────┘  │       │  └──────┬───────┘           │
│                   │       │         │                    │
└───────────────────┼───────┼─────────┼────────────────────┘
                    │       │         │
                    ▼       │         ▼
           ┌────────────────┴─────────────────┐
           │        BOT SERVER (Leapcell)      │
           │                                   │
           │  app.ts ── slash command handler   │
           │    │                               │
           │    ▼                               │
           │  standup.ts ── session manager     │
           │    │  • DM all channel members     │
           │    │  • Track replies              │
           │    │  • Manage timeout             │
           │    │                               │
           │    ▼ (on each reply)               │
           │  ai.ts ── Gemini summarization     │
           │    │                               │
           │    ▼                               │
           │  Post one-liner to #standup        │
           │                                   │
           └───────────────────────────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │  Gemini API   │
                   │  (free tier)  │
                   └───────────────┘


┌───────────────────────────────────────┐
│      LANDING PAGE (Vercel)            │
│                                       │
│  Hero → HowItWorks → Testimonials    │
│  → FAQ → Footer                       │
│                                       │
│  (Static — no connection to bot)      │
└───────────────────────────────────────┘
```

## Bot Server

### Slash Command Handler
**File:** `src/app.ts`
**Implements:** `prd.md > Triggering a Standup`

Registers the `/standup` slash command with Bolt. On invocation:

1. **Channel check:** Verify `command.channel_id` matches `STANDUP_CHANNEL_ID`. If not, respond with ephemeral message: "Head over to #standup to use this command."
2. **Duplicate check:** Check if a standup session is already active (in-memory flag). If yes, respond with ephemeral message: "A standup is already in progress."
3. **Fetch members:** Call Slack's `conversations.members` API to get all user IDs in the channel. Filter out bot users.
4. **Start session:** Create a new `StandupSession` object. Set `active = true`.
5. **Send DMs:** Pass member list to `standup.ts` to DM everyone.
6. **Confirm:** Post ephemeral message to the triggerer: "Standup started! DMs sent to X team members."

**Slack API calls:**
- `conversations.members({ channel: STANDUP_CHANNEL_ID })` — [Docs](https://api.slack.com/methods/conversations.members)
- Ephemeral messages via `command.respond()` (Bolt built-in)

### Session Manager
**File:** `src/standup.ts`
**Implements:** `prd.md > Collecting Responses`, `prd.md > Handling Non-Responses`

Manages the lifecycle of a single standup session.

**Starting a session:**
1. Store member list and initialize a `Map<userId, reply | null>`.
2. For each member, call `chat.postMessage` to send DM with the 3 questions:
   ```
   Hey! Time for standup 🧑‍💻

   1. What did you do yesterday?
   2. What are you working on today?
   3. Any blockers?

   Reply in one message — no formatting needed.
   ```
3. If a DM fails (user has DMs disabled), mark that user as `"unreachable"` in the map.
4. Start the timeout timer.

**Handling replies:**
- Listen for `message` events in DM conversations with the bot.
- When a reply comes in from a user in the active session:
  1. Store the reply text in the session map.
  2. Send acknowledgment: "Got it, thanks! ✌️"
  3. Call `ai.ts` to summarize the reply.
  4. Post the one-liner summary to `#standup`: `@username: [AI summary]`
- If the user is NOT in the active session (late reply after timeout, or no active session), ignore silently.

**Timeout:**
- Use `setTimeout` — 30 seconds for demo, configurable in code.
- When timeout fires:
  1. For each user with `null` in the map (no reply), post to `#standup`: `@username: No response`
  2. For each user marked `"unreachable"`, post to `#standup`: `@username: Unreachable`
  3. Set session `active = false`.

**Slack API calls:**
- `chat.postMessage({ channel: userId, text: ... })` — send DM — [Docs](https://api.slack.com/methods/chat.postMessage)
- `chat.postMessage({ channel: STANDUP_CHANNEL_ID, text: ... })` — post summary line — [Docs](https://api.slack.com/methods/chat.postMessage)

### AI Summarizer
**File:** `src/ai.ts`
**Implements:** `prd.md > AI Summary & Posting`

Single function: takes a user's free-text reply, returns a concise one-liner.

**Gemini API call:**
```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function summarizeReply(replyText: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Summarize this standup update into a single concise sentence.
Cover what they did yesterday, what they're doing today, and any blockers.
Keep it casual and dev-friendly. No bullet points, just one flowing sentence.

Standup update:
${replyText}`,
  });
  return response.text;
}
```

**Model:** `gemini-2.5-flash` — fastest response time, 10 RPM / 250 requests per day on free tier. More than enough for standup summaries.

**Error handling:** If Gemini call fails, fall back to posting the raw reply text instead of a summary. Don't let an AI failure block the standup.

### Types
**File:** `src/types.ts`

```typescript
interface StandupSession {
  active: boolean;
  channelId: string;
  members: Map<string, string | null | "unreachable">;
  // string = reply text, null = no reply yet, "unreachable" = DM failed
  triggeredBy: string;
  startedAt: Date;
  timeoutId: NodeJS.Timeout;
}
```

## Landing Page

### Hero Section
**File:** `src/components/Hero.tsx`
**Implements:** `prd.md > Landing Page` (hero + CTA)

- Bold tagline (e.g., "Async standups that don't suck.")
- One-line description of what StandupBot does
- "Add to Slack" button — styled like Slack's official button, links to `#` (placeholder)
- Dark background, monospace heading font, high-contrast text

### How It Works Section
**File:** `src/components/HowItWorks.tsx`
**Implements:** `prd.md > Landing Page` (how it works)

Three steps with icons or simple illustrations:
1. **Trigger** — "Type `/standup` in your Slack channel."
2. **Respond** — "Everyone gets a DM. Reply in your own words."
3. **Summary** — "AI posts a clean summary as replies come in."

Horizontal layout on desktop, stacked on mobile.

### Testimonials Section
**File:** `src/components/Testimonials.tsx`

3 fictional dev testimonials. Short, punchy quotes with fake names and roles:
- Example: "Our 20-minute standups are now 30-second Slack messages." — Alex, Frontend Lead
- Example: "Finally, a standup bot that doesn't feel like filling out a form." — Sarah, Backend Engineer
- Example: "The AI summaries are surprisingly good. Better than my own updates." — Mike, DevOps

Card layout, dark themed, subtle border or background differentiation.

### FAQ Section
**File:** `src/components/FAQ.tsx`

4-5 common questions with expandable answers:
- "How does the AI summary work?"
- "What if someone doesn't respond?"
- "Can I customize the questions?"
- "Is my data stored anywhere?"
- "How do I set it up?"

Accordion-style expand/collapse.

### Footer
**File:** `src/components/Footer.tsx`

Minimal footer: project name, "Built for [hackathon name]", maybe a GitHub link placeholder.

## Data Model

No database. All state is in-memory.

### StandupSession (in-memory)
| Field | Type | Description |
|-------|------|-------------|
| `active` | `boolean` | Whether a standup is currently running |
| `channelId` | `string` | The `#standup` channel ID |
| `members` | `Map<string, string \| null \| "unreachable">` | User ID → reply status |
| `triggeredBy` | `string` | User ID of who ran `/standup` |
| `startedAt` | `Date` | When the session started |
| `timeoutId` | `NodeJS.Timeout` | Reference to the timeout timer |

Only one session exists at a time. When timeout fires, the session is cleared and a new `/standup` can be triggered.

## File Structure

### Bot Server
```
standup-bot/
├── src/
│   ├── app.ts              # Bolt app init, slash command handler, message listener
│   ├── standup.ts           # Session lifecycle: start, track replies, timeout
│   ├── ai.ts               # Gemini API call for summarization
│   └── types.ts            # TypeScript interfaces
├── .env                     # SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, GEMINI_API_KEY, STANDUP_CHANNEL_ID
├── package.json
├── tsconfig.json
└── README.md
```

### Landing Page
```
standup-landing/
├── src/
│   ├── App.tsx              # Page layout — assembles all sections
│   ├── components/
│   │   ├── Hero.tsx         # Tagline, description, CTA
│   │   ├── HowItWorks.tsx   # 3-step visual breakdown
│   │   ├── Testimonials.tsx # Fictional dev testimonials
│   │   ├── FAQ.tsx          # Accordion Q&A
│   │   └── Footer.tsx       # Minimal footer
│   ├── index.css            # Tailwind directives, dark theme globals
│   └── main.tsx             # React entry point
├── public/
│   └── favicon.ico
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

### Project Root
```
curriculum/
├── standup-bot/             # Slack bot server
├── standup-landing/         # Landing page
├── docs/
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
├── process-notes.md
└── README.md
```

## Key Technical Decisions

### 1. Per-person instant posting vs. batched summary
**Decided:** Post each person's AI summary to `#standup` the moment they reply, rather than waiting for everyone and posting one combined message.
**Why:** Better UX — the channel feels alive as summaries trickle in. Simpler code — no need to orchestrate a "collect all then summarize" step.
**Tradeoff:** The `#standup` channel gets multiple messages instead of one clean summary. Acceptable for a standup bot.

### 2. Hardcoded channel ID via env var
**Decided:** Store `STANDUP_CHANNEL_ID` in `.env` rather than looking up by channel name at runtime.
**Why:** Channel IDs never change. Channel names can be renamed. Eliminates an API call on every `/standup` invocation.
**Tradeoff:** Slightly more setup (copy the ID from Slack), but it's a one-time thing.

### 3. Gemini 2.5 Flash over Claude/OpenAI
**Decided:** Use Google Gemini API for summarization.
**Why:** Free tier with no credit card required. 10 RPM / 250 requests per day — far more than a standup bot needs. TypeScript SDK actively maintained.
**Tradeoff:** Gemini's summarization may be slightly less polished than Claude/GPT-4, but for one-liner standup summaries, the difference is negligible.

## Dependencies & External Services

### Slack API
- **Bot Token Scopes needed:** `commands`, `chat:write`, `im:write`, `im:read`, `im:history`, `channels:read`, `users:read`
- **Event Subscriptions:** `message.im` (to listen for DM replies)
- **Slash Command:** `/standup`
- **Setup:** Create app at [api.slack.com/apps](https://api.slack.com/apps), enable Socket Mode or set Request URL to Leapcell domain
- **Docs:** [Bolt JS Getting Started](https://docs.slack.dev/tools/bolt-js/getting-started/)

### Google Gemini API
- **Model:** `gemini-2.5-flash`
- **Free tier limits:** 10 RPM, 250 requests/day, 250K tokens/min
- **SDK:** `@google/genai` — [npm](https://www.npmjs.com/package/@google/genai)
- **API key:** Generate at [Google AI Studio](https://aistudio.google.com/apikey)
- **Docs:** [Gemini API Quickstart](https://ai.google.dev/gemini-api/docs/quickstart)

### Leapcell (Bot Hosting)
- **Deploys from:** Git repository
- **Build command:** `npm install && npm run build`
- **Start command:** `node dist/app.js`
- **Port:** Configurable in Leapcell dashboard
- **Docs:** [Deploy Node.js on Leapcell](https://docs.leapcell.io/examples/nodejs/express/)

### Vercel (Landing Page Hosting)
- **Deploys from:** Git repository (auto-detects Vite)
- **Build command:** Auto-detected (`npm run build`)
- **Docs:** [Vercel Docs](https://vercel.com/docs)

## Demo Flow

1. Open Slack workspace, show `#standup` channel
2. Type `/standup` — confirmation message appears: "Standup started! DMs sent to 3 team members."
3. Switch to bot DM — show the 3 questions arriving
4. Type a free-text reply — show "Got it, thanks! ✌️" acknowledgment
5. Flip to `#standup` — your AI-summarized one-liner is already posted
6. Wait for timeout (30 seconds) — "No response" messages appear for other members
7. Quick browser switch to the landing page on Vercel — scroll through hero, how it works, testimonials, FAQ
8. Total demo time: ~2-3 minutes

**Test workspace setup:** Create a free Slack workspace with 2-3 test accounts to simulate team members.

## Open Issues

### Slack App Configuration
The bot needs specific OAuth scopes and event subscriptions configured in the Slack app dashboard. This is a manual setup step — not code. The exact Request URL depends on the Leapcell deployment domain, so the Slack app can only be fully configured after first deploy.

### Socket Mode vs. HTTP Mode
Bolt supports both Socket Mode (WebSocket, no public URL needed) and HTTP mode (needs a public URL for events). For local development, Socket Mode is easier. For Leapcell deployment, HTTP mode with the Leapcell URL as the Request URL is the way to go. The code should support both — controlled by an env var or config flag.

### Timeout Duration
30 seconds for demo. The code should make this easy to change (a constant or env var) so a production version could extend to 5-10 minutes. Not a blocker — just a constant to define.
