---
title: Hero Shield
oneLiner: Superhero car insurance — file a claim by talking to an agent, then a CIBA board approves it over email.
topics:
  - ai-agents
  - ciba
  - token-vault
  - human-in-the-loop
author:
  name: Michael Liendo
  github: mtliendo
repo: https://github.com/mtliendo/insurance-demo-new
timeToStandUp: 1–2 hours
auth0Requirements:
  - Regular Web Application (client secret required — not a SPA)
  - Paid tenant with the Auth0 for AI Agents add-on
  - CIBA enabled with the email channel (requested_expiry=600)
  - Token Vault with a Google connection for the host calendar
  - Board members need verified email addresses
otherRequirements:
  - Neon Postgres
  - Anthropic API key
  - Node 22+ and pnpm
talkTrack:
  - The room scans one QR. The host files a Hulk-smashed Honda claim in chat.
  - Approval is not a button in the app — Auth0 emails the seated board. The projector ticks as they accept or decline.
  - A yes is hollow until Token Vault can write the host’s Google Calendar event. That is the third-party grant, not a stored refresh token in your database.
seenAt: []
seeAlso:
  - ciba-email
architecture: docs/architecture.png
stack:
  - Next.js 16
  - Auth0
  - Neon
  - Anthropic
---

## experience

A conference-demo insurance desk. The audience joins through Universal Login. The host seats a CIBA board from verified joiners, then files a claim by talking to an AI agent (white 2006 Honda Pilot, Hulk-smashed). Confirming the claim starts CIBA email for each seated member — never the host, never the whole room. When yeses hit the threshold, Token Vault writes one event on the **host** Google Calendar.

This is the stage script. If you only need to teach the grant, send people to CIBA Email first.

## setup

Setup lives in [SETUP.md](https://github.com/mtliendo/insurance-demo-new/blob/main/SETUP.md). Condensed:

1. `pnpm install` and copy `.env.example` to `.env.local`.
2. Create a **Regular Web Application**. Callback `http://localhost:3000/auth/callback`. You need a client secret.
3. Enable CIBA on that app and select the **email** channel. Use `requested_expiry=600` so Auth0 picks email, not Guardian push (≤300 seconds).
4. Enable Token Vault and connect Google for the host calendar. The app refuses to send CIBA if the host calendar is not connected.
5. Provision Neon and run the schema migration. Add an Anthropic API key.
6. Restart `pnpm dev`. Join from a second browser as a user with a **verified** email before you try to seat a board.

CIBA is not on the Free plan. Reuse one paid demo tenant across later CIBA apps.
