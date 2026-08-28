---
title: Party Animals
oneLiner: A conference card game with a live leaderboard — the booth kit other teams actually run.
topics:
  - events
  - token-vault
  - ai-agents
author:
  name: Michael Liendo
  github: mtliendo
repo: https://github.com/mtliendo/party-animals
liveUrl: https://party-animals-xi.vercel.app
timeToStandUp: 30–45 minutes
auth0Requirements:
  - Regular Web Application and a free Auth0 tenant
  - Token Vault plus a GitHub connection if you run Motif mode (drawings posted as issues)
otherRequirements:
  - Vercel project for the live app
  - Optional: the booth kit repo if you are standing this up for a room
talkTrack:
  - Attendees play a real game; identity is the leaderboard, not a login slide.
  - Token Vault is the punchline when a drawing becomes a GitHub issue without a PAT.
  - Use this when you need something a stranger can run at a booth without you in Slack.
seenAt:
  - React Miami
  - NYC tour stop
  - AI World Fair 2026
  - Des Moines meetup
relatedRepos:
  - label: Booth kit
    url: https://github.com/mtliendo/party-animals-kit
  - label: Results gallery
    url: https://github.com/focusOtter/party-animals-gallery
  - label: Party Night (Token Vault + Box)
    url: https://github.com/mtliendo/party-night
architecture: docs/architecture.png
stack:
  - Next.js
  - Vercel
  - Auth0
---

## experience

Players join a room, play a card game, and watch scores land on a shared leaderboard. At some stops the same app family grows a **Motif** mode: an Excalidraw canvas where a Token Vault–backed agent posts the drawing to GitHub as an issue or a short video. The person in the room never pastes a GitHub token.

That is the experience you are handing an SE — not “here is a repo,” but “here is the game the room will play in the next fifteen minutes.”

## setup

1. Clone [mtliendo/party-animals](https://github.com/mtliendo/party-animals) and install dependencies.
2. Create an Auth0 Regular Web Application. Set callback, logout, and web origins to your local or Vercel URL.
3. Copy `.env.example` to `.env.local` and fill Auth0 domain, client id, secret, and `AUTH0_SECRET`.
4. Run the app locally, confirm login and a complete game, then deploy to Vercel with the same Auth0 application URLs updated for production.
5. For a booth, prefer [party-animals-kit](https://github.com/mtliendo/party-animals-kit) — it is the plug-and-play runbook. Motif / gallery pieces are optional add-ons, not required to put a game on a screen.

Full setup stays in the repo README. Do not invent extra services; the core loop is Auth0 + the Next.js app.
