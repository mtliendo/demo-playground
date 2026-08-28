---
title: JWT Skills
oneLiner: Decode, encode, and validate JSON Web Tokens from the agent — without treating alg as gospel.
topics:
  - jwt
  - ai-agents
author:
  name: Sam Bellen
  github: sambego
repo: https://github.com/jsonwebtoken/jwt-skills
install:
  cursor: |
    npx skills add jsonwebtoken/jwt-skills --agent cursor
  claude: |
    npx skills add jsonwebtoken/jwt-skills --agent claude-code
  chatgpt: |
    npx skills add jsonwebtoken/jwt-skills --agent Codex
  any: |
    npx skills add jsonwebtoken/jwt-skills

    Install one skill only:

    npx skills add jsonwebtoken/jwt-skills -s jwt-decode
stories:
  - title: jwt-decode
    body: Inspect a token without verifying it. Shows header, payload, and claims, and flags alg none or a missing expiration. Use this when someone pastes a JWT and asks what it is.
  - title: jwt-encode
    body: Create and sign tokens for local tests. HMAC, RSA, and ECDSA. Development only — do not treat this as a production issuer.
  - title: jwt-validate
    body: Verify signatures and claims against a shared secret, a PEM key, or a JWKS endpoint. The skill does not trust the token’s alg header, which blocks algorithm-confusion attacks.
whenToUse:
  - Teaching or debugging JWTs in a workshop without opening jwt.io on the projector.
  - Checking whether a customer token is expired, mis-aud’d, or signed with none.
  - Pairing with Auth0 Agent Skills when the problem is the token, not the dashboard.
---

Agent skills for decode, encode, and validate. Secrets stay in environment variables, never argv. Tokens are encoded, not encrypted — the skill flags sensitive payloads. Always confirm output before you use a generated token in anything that matters.
