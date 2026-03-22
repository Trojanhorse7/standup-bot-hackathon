# Evaluation — StandupBot

> **Note:** This evaluation is AI-generated using a structured rubric. It may contain errors — AI scoring of creative work is inherently subjective. Treat these scores as a lossy approximation, not a definitive grade. Your own sense of what you learned matters more than any number here.
>
> Your evaluation also helps us make these learning hackathons better. When you share it as part of your submission, it gives us real signal about what's working in the curriculum and what we should improve. So be honest in the reflection — it genuinely helps.

## Scores

### 1. Scope Clarity: 5/5

**Reasoning:** The idea is crystal clear in one sentence: "A Slack bot that collects async standup responses from team members via DM and posts an AI-generated bullet-point summary to a shared channel." The target user is specific — "small-to-mid-size engineering teams already living in Slack" — not a vague "everyone." Four named cuts (scheduling, auth, database, multi-page site) each have rationale tied to the time constraint. "What Done Looks Like" lists six numbered, verifiable steps. The scope is realistic for a professional fullstack dev with 3-4 hours. All five criteria met.

### 2. Requirements Quality: 5/5

**Reasoning:** Five epics cover the full user journey from triggering through the landing page. User stories use proper format with specific personas ("team lead," "team member," "visitor"). 20+ acceptance criteria are testable by looking at the screen — e.g., "Typing `/standup` in `#standup` shows confirmation with correct member count." Edge cases are well-covered: non-responses, unreachable members, duplicate triggers, wrong channel usage. The learner drove several of these — the "include the triggerer" decision and the "unreachable vs no response" distinction both originated from them. The "What we're building" vs "What we'd add with more time" split is clean and shows real prioritization. The PRD is substantially more detailed than the scope doc — real expansion happened during the conversation.

### 3. Technical Decisions: 5/5

**Reasoning:** Every stack choice has rationale tied to the learner's experience: TypeScript was their explicit preference, Gemini was chosen after researching free-tier options, Bolt was recommended as the official Slack SDK with TypeScript support. File structure is documented with full ASCII trees for both projects plus an architecture diagram showing the complete data flow. PRD cross-references appear throughout the spec — "Implements `prd.md > Triggering a Standup`" on every section. The checklist is sequenced with dependency logic: landing page first (learner's choice), then bot foundation through to deployment. The demo flow is explicitly addressed in the spec with an 8-step walkthrough. The per-person instant posting architecture (learner's idea during /spec) made the demo more dynamic than the original batched approach.

### 4. Spec-to-App Alignment: 4/5

**Reasoning:** The app runs without crashing — both the Slack bot on Leapcell and the landing page on Vercel are deployed and functional. The core user journey works end to end: `/standup` triggers DMs, replies are collected and acknowledged, Gemini generates casual one-liner summaries posted per-person to `#standup`, timeout handles non-responders. The demo video was recorded covering the full flow. Nearly all acceptance criteria from the PRD are met, including edge cases (duplicate prevention, wrong channel redirect, unreachable users, late reply ignored). Minor gap: the summary format evolved from the PRD's batched format with a date header ("Daily Standup — March 22") to individual per-person messages without a header — a deliberate and better design choice, but the date header detail was lost. Landing page exceeded PRD requirements with Testimonials and FAQ sections added.

### 5. Process Quality: 4/5

**Reasoning:** Process notes are rich with evidence of active engagement. The learner drove the project direction — chose the standup bot over the dashboard, delivered the full concept (3-question DMs, AI summary, landing page) in a single unprompted message during /scope, and drove the aesthetic direction (dark mode, monospace, dev-tool energy) entirely on their own.

Key moments of active shaping:
- Changed from batched summary to per-person instant posting during /spec — a major unsolicited architecture improvement
- Self-corrected on DM vs channel flow during /prd without prompting
- Drove "include the triggerer in DMs" with clear rationale: "they are part of the workspace too"
- Added Testimonials and FAQ sections to the landing page unprompted
- Proactively requested nodemon during build step 6

Knowledge checks: 7/9 correct. Misses were "Not available" vs "unreachable" (conceptually close) and "nothing" vs "falls back to raw text" on Gemini failure (a gap in understanding error handling). Overall strong — the learner tracked what was being built throughout.

Slight dip in active shaping in later phases: deferred on animation specifics ("left to you"), bot sequencing ("choose the best lineup"), and channel ID approach ("which is best for the bot?"). Natural trust-building after the structured phases, but represents less ownership of those decisions.

## Overall: 23/25

**Strength:** The per-person instant posting architecture change during /spec was the standout moment. The PRD described a batched summary — the learner said "once anyone replies, let it post that person reply instead of waiting for others." That single decision simplified the code, improved the UX, and made the demo more dynamic. That's the kind of architectural instinct that separates someone building *their* project from someone following a script.

**Growth area:** When things get technical or unfamiliar, the learner tends to defer — "which is best for the bot?", "choose the best lineup", "left to you." Efficient in a hackathon, but on longer projects, deferred decisions compound into parts of the codebase you don't fully own. Next time, try forming an opinion first ("I think X because Y — does that make sense?") even when uncertain. The act of reasoning through it builds understanding faster than accepting a recommendation.

## Reflection

**Q: Looking back at the whole process, what's one thing you'd do differently next time?**

"Deployment — the service made me change the code again. As for the other stuffs, it was a good one."

**Response:** Sharp observation. The Leapcell deployment consumed significant time — Socket Mode failing, health check endpoint issues, switching to ExpressReceiver. Validating the deployment target earlier (even a "hello world" deploy before the full app is built) would have surfaced platform constraints before refactoring under pressure. This applies beyond hackathons: deploy early, deploy often.

## Milestone Completion

- /scope: complete
- /prd: complete
- /spec: complete
- /checklist: complete
- /build: 9/9 checklist items completed
- /iterate: 1 iteration cycle (landing page animations and design polish)
- /evaluate: complete
