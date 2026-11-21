---
title: Anna's Dog Grooming Workshop
oneLiner: Book a grooming visit, add it to Google Calendar with Auth0 Token Vault, and manage bookings from a secure MCP client.
topics:
  - ai-agents
  - token-vault
  - jwt
author:
  name: Michael Liendo
  github: mtliendo
repo: https://github.com/mtliendo/anna-dog-grooming-workshop
liveUrl: https://anna-dog-grooming-workshop.vercel.app/mcp
timeToStandUp: 1 hour (guided workshop)
auth0Requirements:
  - Regular Web Application for Universal Login
  - Google connection with Connected Accounts, Token Vault, and Offline Access
  - Auth0 MCP API with Dynamic Client Registration and bookings:read / bookings:write scopes
otherRequirements:
  - Node.js 24 LTS and npm
  - Google Cloud OAuth client with Google Calendar API enabled
  - An OAuth-capable MCP client for Phase 3
talkTrack:
  - Sign in and book a visit for one of your dogs.
  - Connect Google Calendar and add a grooming reminder without sharing Google tokens with the agent.
  - Connect a client through Dynamic Client Registration, consent, and make calls scoped to your own dogs and visits.
seenAt: []
seeAlso:
  - google-token-vault
architecture: docs/architecture.png
stack:
  - Next.js
  - Auth0
  - Google Calendar
  - MCP
  - SQLite
  - Neon Postgres
---

## experience

The workshop builds a salon in three phases: sign in and manage your own dogs and appointments, connect Google Calendar through Auth0 Token Vault, then let an AI agent manage your bookings. The MCP server verifies the Auth0 access token and checks tool scopes before reading or writing records for that customer.

The **Live** link is the hosted `/mcp` endpoint. Connect it from an OAuth-capable MCP client; an unauthenticated browser request gets an auth challenge. To browse the salon instead, [open the workshop web app](https://anna-dog-grooming-workshop.vercel.app/).

## setup

1. Start with the [Phase 1 README](https://github.com/mtliendo/anna-dog-grooming-workshop) for the local app and Auth0 sign-in.
2. Follow [Phase 2](https://github.com/mtliendo/anna-dog-grooming-workshop/tree/phase-2-calendar) to link Google Calendar through Token Vault.
3. Follow [Phase 3](https://github.com/mtliendo/anna-dog-grooming-workshop/tree/phase-3-mcp) to configure the MCP API and connect an agent through OAuth.
