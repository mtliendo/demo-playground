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
timeToStandUp: 1–2 hours
auth0Requirements:
  - Regular Web Application with Auth0 login
  - Token Vault and a Google Calendar connection
  - CIBA with Guardian push for the last step (plan/feature check before the talk)
otherRequirements:
  - Stripe (Link) for the payment interruption
  - Neon Postgres (SQLite works locally via Prisma)
  - Vercel AI SDK and a model key
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
  - Stripe
  - Neon
---

## experience

An AI flight-booking assistant that escalates in one sitting:

1. **AI SDK interrupt** — missing seat preference. Low stakes, conversational gap-fill.
2. **Auth0 Token Vault** — Google Calendar is not connected. Permission expansion.
3. **Stripe Link** — a promo, then real payment approval. Money moving.
4. **Auth0 CIBA + Guardian** — an airline seat upgrade the user did not start. The agent acts on their behalf; the phone decides.

Same app. Same story. The HIL pattern is the product.

## setup

1. Clone [mtliendo/cascadia-talk-demo](https://github.com/mtliendo/cascadia-talk-demo).
2. `npm install`, copy `.env.example` to `.env.local`.
3. Fill Auth0 (app + Token Vault + CIBA/Guardian), Stripe, and Neon (or use local SQLite).
4. `npm run dev` and walk the four steps in order — that is both the test plan and the talk.

Flight data is mock JSON. There is no real airlines API. Auth0 handles CIBA email natively; this talk path uses Guardian for the last step, so confirm the tenant can send push before you promise it on stage.
