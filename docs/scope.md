# StandupBot

## Idea
A Slack bot that collects async standup responses from team members via DM and posts an AI-generated bullet-point summary to a shared channel.

## Who It's For
Dev teams who are tired of synchronous standup meetings eating into their mornings. Specifically, small-to-mid-size engineering teams already living in Slack who want a lightweight async alternative.

## Inspiration & References
- [Geekbot](https://geekbot.com/) — the established player in async Slack standups. Clean UX, dead-simple value prop: "ship more, meet less." Our differentiator is the AI summary layer.
- [Bryce York's open-source Slack AI](https://bryceyork.com/free-open-source-slack-ai/) — proof that a Slack + AI integration is buildable in days, not weeks.
- [Saaspo dark mode collection](https://saaspo.com/style/dark-mode) — visual reference for the landing page aesthetic.
- [Figma dev-tool landing page template](https://www.figma.com/community/file/1501958659966458611/developer-friendly-landing-page-design-inspiration-tech-landing-page-dark-mode-design) — dark mode, developer-friendly energy.

Design energy: dark mode, monospace fonts, minimal, dev-tool aesthetic. Think terminal-inspired, not corporate SaaS.

## Goals
- A working Slack bot that completes the full standup flow end to end: trigger, collect, summarize, post.
- A clean single-page landing site that matches the dev-tool vibe.
- The pride of demoing something that actually works live — bot responding in real time.

## What "Done" Looks Like
1. User triggers `/standup` slash command in Slack.
2. Bot DMs each team member with 3 questions: what did you do yesterday, what are you doing today, any blockers?
3. Team members reply in DMs with free-text answers.
4. Bot collects all replies, sends them to an AI (likely OpenAI or Claude API) to generate a bullet-point summary.
5. Bot posts the formatted summary to a shared `#standup` channel.
6. A single-page landing site is live with a hero section, "how it works" breakdown, and a CTA.

## What's Explicitly Cut
- **Automatic daily scheduling** — replaced with a manual `/standup` slash command trigger. Scheduling adds cron jobs, timezone handling, and persistent config that would eat hours. The demo flow is identical without it.
- **User authentication / team onboarding dashboard** — no sign-up flow, no settings UI. For the hackathon, it works for one pre-configured team.
- **Database / persistent storage** — standup responses live in memory for the session. No historical data, no analytics.
- **Multi-page landing site** — single page only. Hero, how it works, CTA. Done.

## Technical Experience
- **Level:** Fullstack developer (professional)
- **Strong in:** Python, JavaScript, React, Node.js
- **Daily workflow:** Git-heavy, manual merge conflict resolution, team collaboration in Slack
- **Explore:** Slack Bot API, AI integration for text summarization

## Loose Implementation Notes
- Slack Bot built with Node.js (Bolt for Slack framework is a natural fit)
- AI summarization via OpenAI or Claude API — simple prompt, bullet-point output
- Landing page in React — single page, dark theme, could use Tailwind for fast styling
- In-memory data store for standup responses (no database needed for hackathon scope)
