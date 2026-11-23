---
title: Trip Planner
oneLiner: One flight-booking agent. Four interruptions. Stakes go up without changing apps.
topics:
  - ai-agents
  - token-vault
  - ciba
  - human-in-the-loop
author:
  name: Michael Liendo
  github: mtliendo
repo: https://github.com/mtliendo/cascadia-talk-demo
liveUrl: https://focus-otter-trip-planner.vercel.app
timeToStandUp: 1–2 hours
auth0Requirements:
  - Regular Web Application with Auth0 login
  - Token Vault and a Google Calendar connection
otherRequirements:
  - Vercel AI Gateway access
talkTrack:
  - Do not context-switch demos. The audience watches one booking flow while the interruption type changes.
  - Match the interruption to the consequence — a confirm button is not a push notification is not moving money.
  - The agent surfaces the need and defers. It does not just hit a wall.
seenAt:
  - CascadiaJS
  - AI World Fair SF
seeAlso: []
architecture: docs/architecture.png
stack:
  - Next.js
  - Vercel AI SDK
  - Auth0
  - Google Calendar
---

## experience

An AI flight-booking assistant that escalates in one sitting:

1. **AI SDK interrupt** — missing seat preference. Low stakes, conversational gap-fill.
2. **Auth0 Token Vault** — connect Google Calendar and approve adding the flight to your calendar.
3. **Simulated Stripe Link** — find a promo and approve a sample payment. No Stripe request or charge.
4. **Simulated Auth0 CIBA + Guardian** — approve or decline a sample seat upgrade in chat. No email or push is sent.

Same app. Same story. The HIL pattern is the product.

## setup

1. Clone [mtliendo/cascadia-talk-demo](https://github.com/mtliendo/cascadia-talk-demo).
2. `npm install`, copy `.env.example` to `.env.local`.
3. Configure Auth0 login, the Google Calendar Token Vault connection, and Vercel AI Gateway as described in the repo README.
4. `npm run dev` and walk the four steps in order — that is both the test plan and the talk.

Flight data is mocked. The demo does not book or charge for flights.
