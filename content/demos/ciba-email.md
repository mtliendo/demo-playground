---
title: CIBA Email
oneLiner: The smallest possible Auth0 CIBA-over-email loop — log in, type a binding message, approve from your inbox.
topics:
  - ciba
  - human-in-the-loop
author:
  name: Michael Liendo
  github: mtliendo
repo: https://github.com/mtliendo/ciba-email
timeToStandUp: 20–30 minutes
auth0Requirements:
  - Confidential Regular Web Application (client secret)
  - CIBA grant enabled with the email notification channel
  - requested_expiry of 301–259200 seconds (this demo uses 600) so Auth0 chooses email, not Guardian
  - Authorizing user must have a verified email
  - Not available on the Free plan — Essentials plus the Auth0 for AI Agents add-on, or confirm CIBA email on your trial
otherRequirements:
  - Next.js and the Auth0 Next.js SDK
talkTrack:
  - This is the teaching grant, not a product. One button. One email. Tokens come back when they Accept.
  - login_hint is iss_sub, not a raw email. binding_message is required, 64 characters, no spaces.
  - Send Hero Shield after this if they need to see CIBA in a room with a board and a calendar.
seenAt: []
seeAlso:
  - hero-shield
architecture: docs/architecture.png
stack:
  - Next.js
  - Auth0
---

## experience

Learning demo, not a product. You log in, type a binding message, click one button. The app `POST`s `/bc-authorize`. Auth0 emails the authorizing user. They Accept. The app polls `/oauth/token` with the CIBA grant until tokens return.

Use this when someone says “show me CIBA” and you do not want to stand up insurance, calendars, or a live board.

## setup

1. Clone [mtliendo/ciba-email](https://github.com/mtliendo/ciba-email) and install.
2. Create a Regular Web Application. Callback `http://localhost:3000/auth/callback`.
3. Application settings: enable **Client Initiated Backchannel Authentication** and select **email**.
4. Copy env vars. This demo authorizes a configured `iss_sub` (or the session `sub` if you log in as that user). Set `AUTH0_CIBA_SUB` if you are not that user.
5. Binding messages: letters, numbers, and `+-_.,:#` only. The app turns spaces into hyphens. Max 64 characters.

Leave the default Auth0 email provider for local demos. Customize **Branding → Email Templates → Asynchronous Approval** only if you are taking this near a customer screen.

Pricing notes live in the repo README. You only need one paid tenant — reuse it for Hero Shield and Trip Planner.
