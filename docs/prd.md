# StandupBot — Product Requirements

## Problem Statement
Dev teams waste 15-30 minutes every morning in synchronous standup meetings that could be a message. For teams already living in Slack, there's no lightweight way to collect "what I did, what I'm doing, any blockers" asynchronously and get a clean summary without someone manually compiling it. StandupBot replaces the meeting with a slash command, AI-generated summaries, and zero formatting overhead.

## User Stories

### Epic: Triggering a Standup

- As a team lead, I want to kick off a standup with a single slash command so that I don't have to manually ping everyone or schedule a meeting.
  - [ ] Typing `/standup` in the `#standup` channel sends DMs to all channel members
  - [ ] The person who triggered it sees a confirmation in the channel: "Standup started! DMs sent to X team members."
  - [ ] The command only works in the `#standup` channel
  - [ ] If `/standup` is used outside `#standup`, the user gets a message explaining where to use it
  - [ ] If a standup is already in progress, the user sees "A standup is already in progress" and no duplicate is created

### Epic: Collecting Responses

- As a team member, I want to receive a DM from the bot with the 3 standup questions so that I can reply on my own time without joining a call.
  - [ ] The DM contains all 3 questions in a single message: what did you do yesterday, what are you doing today, any blockers?
  - [ ] Every member of the `#standup` channel receives the DM, including the person who triggered the standup
  - [ ] The team member replies with a single free-text message — no special formatting required
  - [ ] The bot acknowledges the reply (e.g., "Got it, thanks!")

- As a team member, I want the process to be frictionless so that it takes me less than a minute.
  - [ ] No sign-up, no configuration, no onboarding — if you're in `#standup`, you're in
  - [ ] Reply once, done. No follow-up prompts or confirmations needed beyond the acknowledgment

### Epic: Handling Non-Responses

- As a team lead, I want to know who didn't respond so that I can follow up if needed.
  - [ ] If a team member doesn't reply within the timeout window (short for demo, longer in production), the summary notes "No response" next to their name
  - [ ] If the bot can't DM a team member (e.g., they haven't allowed bot DMs), the summary notes "Unreachable" next to their name
  - [ ] Non-responses don't block the summary from being posted — the bot posts what it has when the timeout expires

### Epic: AI Summary & Posting

- As a team lead, I want an AI-generated summary posted to the channel so that I can see everyone's status at a glance without reading individual messages.
  - [ ] Once all replies are in (or the timeout expires), the bot sends all responses to an AI API
  - [ ] The AI generates a per-person bullet-point summary
  - [ ] The summary is posted to the `#standup` channel with a date header (e.g., "Daily Standup — March 22")
  - [ ] Each person's entry is a concise one-liner distilled from their free-text reply
  - [ ] Non-responders show as "@name: No response"
  - [ ] Unreachable members show as "@name: Unreachable"
  - [ ] The summary format looks like:
    ```
    Daily Standup — March 22

    @alex: Finished the auth refactor yesterday, working on tests today, no blockers.
    @sarah: No response.
    @mike: Fixed the deployment bug, picking up the API migration, blocked on staging access.
    ```

### Epic: Landing Page

- As a visitor, I want to understand what StandupBot does within seconds of landing on the page so that I can decide if it's relevant to my team.
  - [ ] Hero section with a clear tagline and a brief description of what the bot does
  - [ ] "How It Works" section with 3 steps: trigger, respond, summary
  - [ ] "Add to Slack" CTA button — placeholder for the hackathon (doesn't need to function)
  - [ ] Dark mode, monospace fonts, minimal dev-tool aesthetic
  - [ ] Single page, no navigation to other pages
  - [ ] Responsive — looks decent on mobile even if not pixel-perfect

## What We're Building
1. **Slack bot with `/standup` command** — triggers DMs to all `#standup` channel members, collects free-text replies, enforces one-at-a-time standup sessions
2. **Response collection with timeout** — gathers replies, handles non-responses and unreachable members gracefully
3. **AI-powered summary** — sends collected responses to an AI API, generates per-person bullet-point summary, posts to `#standup`
4. **Single-page landing site** — hero, 3-step "how it works," placeholder "Add to Slack" CTA, dark/monospace/minimal design

## What We'd Add With More Time
- **Automatic daily scheduling** — cron-based trigger every morning at a configurable time, with timezone support
- **Standup history** — persistent storage so you can look back at previous standups
- **Configurable questions** — let teams customize the 3 questions or add more
- **Thread-based responses** — post the summary as a thread with individual details expandable
- **Working "Add to Slack" OAuth flow** — real installation flow for any workspace
- **Reminder nudges** — if someone hasn't replied after X minutes, send a gentle reminder DM

## Non-Goals
- **No user authentication or onboarding** — the bot works for one pre-configured workspace. No sign-up, no settings dashboard.
- **No persistent storage** — standup data lives in memory for the session only. No database, no history, no analytics.
- **No scheduled automation** — standups are triggered manually via slash command. No cron, no timers, no recurring schedules.
- **No multi-workspace support** — built for one team in one Slack workspace.
- **No custom configuration UI** — questions are hardcoded, timeout is hardcoded, channel is hardcoded. All configurable in code but not via UI.

## Open Questions
- **Which AI API to use (OpenAI vs Claude)?** — Needs answering before /spec. Both work; comes down to preference and API ergonomics.
- **Exact timeout duration for demo?** — Can decide during build. Somewhere between 10-30 seconds for demo purposes.
- **Bot acknowledgment message wording?** — Minor, decide during build. Something simple like "Got it, thanks!"
