---
title: Otter Ops
oneLiner: Meet the raft and feed an otter while AWS API Gateway enforces Auth0 JWTs and scopes before Lambda runs.
topics:
  - jwt
author:
  name: Michael Liendo
  github: mtliendo
repo: https://github.com/focusOtter/auth0-api-gateway-otters
liveUrl: https://auth0-api-gateway-otters.vercel.app
timeToStandUp: 30–60 minutes
auth0Requirements:
  - Regular Web Application with callback and logout URLs for the Next.js app
  - Auth0 API with an RS256 signing algorithm and the feed:otters permission
  - A demo user granted feed:otters to try feeding
otherRequirements:
  - Node.js and npm
  - AWS credentials and a CDK-bootstrapped AWS account for a cloud deployment
talkTrack:
  - Read otter facts without signing in, then sign in to unlock the raft roster.
  - Deliver a snack with a token that has the feed:otters scope.
  - Compare native JWT authorizers on AWS HTTP APIs and REST APIs without changing the frontend.
seenAt: []
architecture: docs/architecture.png
stack:
  - Next.js
  - Auth0
  - AWS API Gateway
  - AWS Lambda
  - AWS CDK
---

## experience

The browser calls API Gateway directly. Facts are public, the otter roster requires a valid Auth0 access token, and feeding additionally requires the `feed:otters` scope. API Gateway rejects unauthorized requests before the business Lambda runs.

The diagram shows the HTTP API variant. The hosted demo uses the [REST API variant](https://github.com/focusOtter/auth0-api-gateway-otters/blob/main/docs/architecture-rest.png), which implements the same route permissions with a native REST JWT authorizer.

## setup

1. Clone the repo and follow the README to configure the Auth0 web app, API audience, and feeding permission.
2. Use the local gateway emulator or deploy the HTTP or REST stack with CDK.
3. Point the Next.js frontend at the gateway base URL. Keep the stage path for the REST API.
