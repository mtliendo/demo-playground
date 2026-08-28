---
title: AWS Service Heroes
oneLiner: Booth selfie in, service-themed hero out — Token Vault files the GitHub issue after they walk away.
topics:
  - events
  - token-vault
  - ai-agents
author:
  name: Michael Liendo
  github: focusOtter
repo: https://github.com/focusOtter/aws-service-heroes
timeToStandUp: 2+ hours
auth0Requirements:
  - Auth0 application used by the Next.js booth frontend
  - Token Vault with a GitHub connection — no personal access token in the app
otherRequirements:
  - AWS account and the sibling CDK backend (S3, DynamoDB, Lambda, Bedrock, CloudFront)
  - Gemini (image) and Bedrock Luma Ray 2 (video)
  - A GitHub repo that can receive issues
  - Vercel for the frontend
talkTrack:
  - The booth device is free in seconds: the still comes back first, video is async.
  - The Auth0 punchline is after they leave — completion Lambda patches the GitHub issue through Token Vault, not a stored PAT.
  - Use this when the room is AWS-shaped and you still need an identity grant, not a Cognito sidebar.
seenAt:
  - AWS Summit NYC
relatedRepos:
  - label: CDK backend
    url: https://github.com/focusOtter/aws-service-heroes-backend
  - label: Live gallery
    url: https://github.com/focusOtter/aws-service-heroes-gallery
architecture: docs/architecture.png
stack:
  - Next.js 16
  - Auth0 Token Vault
  - AWS CDK
  - Gemini
  - Amazon Bedrock
---

## experience

An attendee picks a favorite AWS service, takes a photo, and chooses a style. The app composites an identity-preserving hero still, starts a short video, posts the still to GitHub as an issue, and fills a live gallery. Minutes later the mp4 lands in S3; a completion Lambda patches that same issue with the video link using a federated Token Vault exchange — the user is already gone.

The frontend is the Vercel app. AWS lives in the backend repo. Treat them as one booth experience.

## setup

This is a two-repo stand-up. Read [aws-service-heroes](https://github.com/focusOtter/aws-service-heroes) and [aws-service-heroes-backend](https://github.com/focusOtter/aws-service-heroes-backend) together.

1. Deploy the CDK backend (S3, DynamoDB, Bedrock async invoke, completion Lambda, CloudFront).
2. Configure Auth0 Token Vault for GitHub on the booth app. The frontend stores a job record that includes what Token Vault needs later — it does not embed a PAT.
3. Set Gemini (with a fallback model; `gemini-3-pro-image` 503s under booth load) and Bedrock Luma Ray 2.
4. Deploy the Next.js 16 frontend to Vercel. Point it at the backend outputs.
5. Walk one selfie through image → issue → async video → gallery poll before you put a queue at the table.

Do not pick this for a 20-minute hallway slot. CIBA Email or Party Animals will fail softer.
