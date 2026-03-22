# Process Notes

## /scope

### How the idea evolved
- Started with two competing directions: an API status dashboard and a Slack standup bot. No strong preference or pain point driving either.
- When pushed on what felt more exciting, the learner said both were interesting — no clear winner from enthusiasm alone.
- When asked about daily frustrations, merge conflicts surfaced as a real pain point, but the learner ultimately circled back to the Slack standup bot on their own initiative.
- The concept sharpened significantly when the learner unprompted described the full flow: DMs with 3 questions, text replies, AI summary posted to #standup, plus a landing page. This was the turning point — went from vague to specific in one message.

### Pushback and responses
- Challenged "useful and functional" as too vague — redirected toward specific daily frustrations, which surfaced merge conflicts and eventually led back to the standup bot with much more clarity.
- Suggested cutting automatic daily scheduling in favor of a `/standup` slash command to save time. Learner accepted immediately — good instinct for scope management.
- Scoped landing page down to a single static page. Learner was already there — no resistance.

### References that resonated
- Geekbot as the established product in this space — validated that the concept is real and viable.
- Bryce York's 3-day Slack AI build — proof of feasibility in a short timeframe.
- Dark mode SaaS landing page collections for visual direction.

### Technical experience
- Professional fullstack developer. Strong in Python, JavaScript, React, Node.js.
- Daily git workflow, team collaboration in Slack — the bot is something they'd actually use.
- New to Slack Bot API and AI integration for summarization.

### Active shaping
- The learner drove the final direction. Despite initially being indecisive between two ideas, they chose the standup bot unprompted and then delivered a detailed concept description without being asked — the 3-question DM flow, AI summary, and landing page all came from them in a single message.
- Accepted scope cuts readily, suggesting good judgment about what matters for a demo.
- Aesthetic direction (dark mode, monospace, dev-tool energy) was entirely learner-driven.

## /prd

### What the learner added or changed vs the scope doc
- Initially said questions should appear in the channel after `/standup`, then self-corrected and reverted to the DM flow from the scope doc — showed awareness of the original design decision.
- Added a confirmation message in the channel showing how many people were DM'd — not in the scope, came from the learner.
- Specified that the bot should acknowledge replies with a "Got it" message — new detail.
- Decided all 3 questions in a single DM, single free-text reply — no back-and-forth conversational flow. Keeps it minimal.

### "What if" questions and responses
- **Non-responses/timeout:** Learner immediately had a clear answer — short timeout, note "no response" in summary. Acknowledged that a few seconds is demo-friendly and a real version would be longer. Good awareness of demo vs. production tradeoffs.
- **Unreachable members (can't DM):** Clean answer — show as "unreachable" in the summary. Distinct from "no response."
- **Duplicate standup triggers:** Firm "just one" — block duplicates while a standup is in progress.
- **Who gets DM'd (including the triggerer):** Learner explicitly chose to include the triggerer — "they are part of the workspace too."

### Scope guard conversations
- No scope creep during this phase. The learner stayed tight and didn't try to add features. Every answer was concise and decisive.
- "What we'd add with more time" items (scheduling, history, configurable questions, reminder nudges) were natural extensions identified during conversation, not things the learner tried to sneak in.

### Active shaping
- The learner was decisive throughout — short, direct answers that showed they had a clear picture of what they wanted.
- Self-corrected on the DM vs. channel question flow without prompting, showing they were actively thinking about consistency with their original design.
- Drove the "include the triggerer in DMs" decision with a clear rationale.
- Landing page decisions (3-step how-it-works, placeholder CTA) were quick and firm — no waffling.

## /spec

### Technical decisions and rationale
- **TypeScript everywhere:** Learner's choice — wanted type safety across both projects. Strong preference, not prompted.
- **Per-person instant posting:** Major architecture change from the PRD. Learner initiated this — "once anyone replies, let it post that person reply instead of waiting for others." Simplified the collection logic and improved the UX.
- **Gemini 2.5 Flash:** Learner asked which API was free. After research, Gemini was the clear winner — free tier, no credit card, generous limits. Practical decision.
- **Hardcoded channel ID in .env:** Proposed as the simpler option vs. name lookup. Learner asked "which is best for the bot?" — deferred to recommendation here.
- **Two separate apps (bot + landing page):** Clean separation, no shared code. Learner agreed immediately.
- **Leapcell for bot, Vercel for landing page:** Learner's own choices, came in with these platforms already in mind.

### Confident vs. uncertain
- **Confident:** File structure, per-person posting flow, timeout behavior, landing page sections, TypeScript choice, ignoring late replies.
- **Uncertain:** Which AI API to use (asked for free options), whether to hardcode channel ID (asked for recommendation). Both resolved quickly.

### Self-review findings
- PRD/spec mismatch on summary format (batched vs. per-person) — flagged to learner, confirmed the change.
- Landing page expanded from 3 sections (PRD) to 5 sections (spec) — learner drove this addition (testimonials + FAQ).
- Socket Mode vs. HTTP Mode for Slack noted as an open issue — affects local dev vs. deployed behavior.

### Stack choices
- Node.js + Bolt for Slack (official SDK, TypeScript support)
- React + Vite + Tailwind for landing page (learner's preferred stack)
- Google Gemini 2.5 Flash for AI (free tier, no credit card)
- Leapcell for bot deployment, Vercel for landing page

### Active shaping
- The biggest learner-driven decision was changing from batched summary to per-person instant posting. This wasn't suggested — the learner came up with it mid-conversation and it fundamentally changed the architecture for the better.
- Learner added testimonials and FAQ sections to the landing page unprompted — "let there be footer and hero section also. add like one or 2 other sections also."
- Asked "which is best for the bot?" on channel ID approach — one of the few moments where they deferred to recommendation rather than deciding independently.
- Firm on ignoring late replies: "the standup is done." Clean, no ambiguity.

## /build

### Step 1: Landing page scaffolding and all sections
- Built React + Vite + TypeScript + Tailwind project in `standup-landing/` with five components: Hero, HowItWorks, Testimonials, FAQ, Footer.
- Hit a Node version compatibility issue — Vite 8 requires Node 22.12+, learner had 22.11.0. Learner chose to upgrade Node rather than downgrade Vite. Upgraded to 22.12.0 via nvm.
- Verification: Learner confirmed all five sections visible, dark theme working, FAQ accordion functional.
- Knowledge check: "What does the How It Works section communicate?" → "trigger, respond, summary" — correct.
- No bugs or design concerns raised. Clean build.

## /checklist

### Sequencing decisions and rationale
- Landing page first — learner's choice. Gets the simpler piece done and provides an early visual win before diving into the bot's complexity.
- Bot setup + types before any Slack integration — everything depends on the project scaffold and session interface.
- Slash command before DMs — the entry point needs to work before anything downstream.
- Reply collection before AI — verify the full Slack flow works without the Gemini dependency. Easier to debug.
- AI summarization before timeout — the "wow moment" should work before polishing edge cases.
- Timeout and edge cases near the end — these are polish, not core flow.
- Deploy before demo video — need live URLs to show in the recording.

### Build preferences
- Git: commit after each step
- Verification: visual confirmation in dev server / Slack workspace
- Check-in cadence: balanced

### Item count and estimated time
- 9 items, ~20-25 minutes each = ~3-3.75 hours. Tight but realistic for a professional fullstack dev.

### Confident vs. needed guidance
- Learner chose to build the landing page first — a deliberate preference, not uncertainty.
- Deferred to recommendation on bot sequencing: "choose the best lineup." Practical decision — they trust the dependency logic.

### Demo video planning
- 2-3 minute target. Problem statement → full bot flow in Slack → landing page on Vercel.
- "Wow moment" is the AI summary appearing in #standup instantly after a reply.
- Test workspace with 2-3 accounts for realistic demo.

### Active shaping
- The learner drove one key decision: building landing page first. This was their call, not suggested.
- Accepted the bot sequencing as proposed — reasonable for someone who recognizes dependency logic but doesn't need to debate it.
