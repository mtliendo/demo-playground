---
title: Agentic Arcade
oneLiner: A tiny game library with an AI concierge — games unlock as you harden the Auth0 account.
topics:
  - ai-agents
  - token-vault
  - ciba
  - events
  - human-in-the-loop
  - roles
author:
  name: Jessica Temporal
  github: jtemporal
repo: https://github.com/jtemporal/game-library-demo
timeToStandUp: 45–90 minutes
auth0Requirements:
  - Auth0 tenant (free tier is enough to sign in and play the gated lobby)
  - Verified email, passkeys, Guardian MFA, and Token Vault/Google if you want every bonus game
  - An `arcade-admin` role plus Management API access for the all-access pass flow
otherRequirements:
  - Node 20+
  - Anthropic or xAI API key for the concierge
talkTrack:
  - Identity is the difficulty curve. Dino Dash wants a verified email; Snake wants a passkey; Whack-a-Mole wants Guardian; Reflex wants Google via Token Vault.
  - The concierge calls the Scores API with the player’s scoped JWT — first-party, on the user’s behalf.
  - “Reset my scores” is async authorization: the agent will not pause, but the reset only happens when the user approves the action through a Guardian push.
seenAt:
 - Temporal.io - Vibe Check (Live Stream)
seeAlso: []
architecture: docs/architecture.png
stack:
  - Next.js
  - Auth0 for AI Agents
  - Anthropic / xAI
---

## experience

Players sign in and meet an AI concierge in a small arcade. The agent always knows who it acts for. Games stay locked until the account is stronger:

| Game | Unlock |
| --- | --- |
| Dino Dash | Verified email |
| Snake | Passkey enrolled |
| Whack-a-Mole | Guardian MFA |
| Reflex | Google connected (Token Vault-ready) |

Players can skip the grind: ask the concierge for an all-access pass. An `arcade-admin` approves (or later revokes) at `/admin` via the Management API. “Reset my scores” waits on a Guardian push.

This is Jess’s Auth0 for AI Agents sampler in one readable app — user auth, call-your-APIs, human-in-the-loop, Token Vault, and CIBA.

## setup

1. Clone [jtemporal/game-library-demo](https://github.com/jtemporal/game-library-demo).
2. Create an Auth0 app and copy the env values the README expects.
3. Add an Anthropic or xAI key for the concierge.
4. For the full unlock path, turn on email verification, passkeys, Guardian, and a Google connection on Token Vault.
5. Create the `arcade-admin` and `all-access` roles if you want the concierge bypass. Details are in the repo (step 6 in the README).

Free-tier login works for a hallway demo. Do not promise every game unless MFA and Token Vault are actually on the tenant.
