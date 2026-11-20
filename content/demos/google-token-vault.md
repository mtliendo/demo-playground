---
title: Google Token Vault (Orbit)
oneLiner: A chat agent that reads Google Calendar and drafts Gmail using Google tokens managed by Auth0 Token Vault.
topics:
  - ai-agents
  - token-vault
author:
  name: Michael Liendo
  github: mtliendo
repo: https://github.com/focusOtter/google-token-vault
liveUrl: https://google-token-vault.vercel.app
timeToStandUp: 1–2 hours
auth0Requirements:
  - Regular Web Application with Authorization Code, Refresh Token, and Token Vault grants
  - Google social connection with Authentication and Connected Accounts for Token Vault and Offline Access
  - My Account API user-delegated create:me:connected_accounts permission and application MRRT policy
otherRequirements:
  - Google Cloud OAuth web client with Calendar and Gmail APIs enabled
  - Google consent scopes calendar.events.readonly and gmail.compose; approved test user while in Testing
  - Neon Postgres and Drizzle for user-scoped conversation history
  - Vercel AI Gateway access; API key locally or Vercel OIDC when deployed
talkTrack:
  - Ask about the week, then show the Google consent popup when a connected account or scope is missing.
  - Auth0 Token Vault supplies provider tokens to server-side tools, not to the model or chat history.
  - Create a draft and review it in Gmail. The app cannot send mail, although Google's gmail.compose scope permits sending.
  - This is interactive Connected Accounts consent, not CIBA or asynchronous approval.
seenAt: []
seeAlso:
  - trip-planner
  - aws-service-heroes
architecture: docs/architecture.svg
stack:
  - Next.js
  - Auth0
  - Vercel AI SDK
  - Vercel AI Gateway
  - Neon
  - Drizzle
---

## experience

Orbit is a conversational assistant for two everyday tasks: read your Google Calendar and prepare a Gmail draft. Sign in, ask “What's on my calendar this week?”, and connect Google when prompted. After consent, the interrupted tool resumes without making you repeat the request.

Give Orbit a recipient, subject, and message to create an email draft, then review it in Gmail. There is no send tool, calendar write, CIBA, or background approval flow. Google access tokens stay in the server-side tool context; the assistant receives tool results, not credentials.

Past conversations reopen from a user-scoped history sidebar. The preview image is the app's generated Open Graph artwork, not an authenticated chat screenshot.

## setup

1. Clone [focusOtter/google-token-vault](https://github.com/focusOtter/google-token-vault) and check out `devin/google-token-vault-app` while the app's PR is awaiting merge. Use Node LTS and `pnpm install`.
2. Follow the repository README to create a confidential Auth0 application, enable the Token Vault grant, and configure the My Account API user-delegated permission and MRRT policy. Add exact local and deployed callback, logout, and origin URLs.
3. Enable Calendar and Gmail APIs in Google Cloud. Create your own OAuth web client using the Auth0 connection's `/login/callback` redirect, configure the two Google scopes, and add your Google account as a test user if the consent screen is in Testing.
4. Configure a Google connection for authentication and Connected Accounts with Offline Access. Set `AUTH0_GOOGLE_CONNECTION` to its name; the default is `google-oauth2`, and the live demo uses a dedicated `google-token-vault` connection.
5. Copy `.env.example` to `.env.local`, fill the Auth0, Neon, and local AI Gateway settings, then load those variables into your shell before running `pnpm db:migrate`. Run `pnpm dev`.
6. Sign in, allow the Google consent popup, ask for calendar events, and create a draft. Verify the draft in Gmail; nothing is sent automatically.

The live demo's Google consent screen is in Testing, so Google access is limited to approved test users. For your own deployment, use your own OAuth credentials and test users. Google's testing-mode tokens can expire, and production Gmail permissions may require verification. Draft creation is not idempotent: retrying a completed request can create another draft.
