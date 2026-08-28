---
title: Auth0 Agent Skills
oneLiner: One official skill that detects your framework, then implements Auth0 — including tenant audit and plan-fit.
topics:
  - ai-agents
  - tenant-ops
author:
  name: Auth0
  github: auth0
repo: https://github.com/auth0/agent-skills
install:
  cursor: |
    Auth0 is on the Cursor marketplace. Open the listing and click Add.

    Or from any Agent Skills CLI:

    npx skills add auth0/agent-skills --agent cursor
  claude: |
    /plugin install auth0@claude-plugins-official

    Or from the terminal:

    claude plugin install auth0@claude-plugins-official
  chatgpt: |
    Auth0 ships an OpenAI-compatible skills plugin in the repo (.agents/plugins/marketplace.json). Add that marketplace, then install Auth0 from the Plugins UI.

    It is not in the universal ChatGPT / Codex directory until OpenAI approves the submission. Until then:

    npx skills add auth0/agent-skills --agent Codex
  any: |
    npx skills add auth0/agent-skills
stories:
  - title: Router and frameworks
    body: Install once. The auth0 skill reads package.json, requirements.txt, build.gradle, and friends, then loads the matching SDK reference — Next.js, Python, mobile, API, and 25+ other frameworks. You do not pick auth0-nextjs vs auth0-react anymore. Those names are gone. If a small model misses the trigger, invoke /auth0 explicitly.
  - title: Checkmate (audit)
    body: The audit intent is Checkmate, folded into this skill. Ask to audit a tenant. The agent bootstraps a dedicated M2M app (read scopes), runs Checkmate, writes a markdown and PDF report, and only applies fixes with per-command confirmation. This is the security self-audit SEs keep requesting. Same install as the router — not a second package.
  - title: Healthcheck
    body: The healthcheck intent scores whether a tenant is healthy and on the right plan, then recommends a path. It shares Checkmate’s pricing and remediation references. Use it when the question is “are we on the wrong SKU,” not “run every security control.”
  - title: When to type /auth0
    body: Auto-detection is reliable on capable models. On a small or fast model in a session with many other skills, open-ended “how do I…?” questions can miss the trigger. /auth0 how do I configure brand colors in Auth0? skips selection entirely.
whenToUse:
  - Adding, fixing, or reviewing Auth0 login, MFA, Organizations, or API authorization in an app.
  - Running a tenant security or configuration audit (Checkmate) before a customer conversation.
  - Checking plan fit (Healthcheck) when someone asks if they need to upgrade.
---

Official Auth0 agent skills for Claude Code, Cursor, Codex, GitHub Copilot, and any client that speaks the Agent Skills format. One `auth0` skill routes by framework and intent. Checkmate and Healthcheck are featured intents on this page — they are not separate installs.
