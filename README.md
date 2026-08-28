# Auth0 Showcase

Public catalog of runnable **Auth0 demos** and **agent skills**. Home is the catalog. Maintained by Auth0 Developer Advocacy. This is not an official Auth0.com property and it does not replace [Code Samples](https://developer.auth0.com/resources/code-samples).

## Develop

```bash
pnpm install
pnpm dev
```

Content is the source of truth:

- `content/demos/*.md`
- `content/skills/*.md`

Add an entry by adding a file. Submit from the site goes to GitHub issue templates in `.github/ISSUE_TEMPLATE/`.

Architecture diagrams live in each **source demo repo** at `docs/architecture.png`. This package ships `skills/showcase-architecture` to help draft them.

Set `NEXT_PUBLIC_GITHUB_REPO` (default `focusOtter/demo-playground`) so Submit links hit the right issue tracker.

## Analytics

[@vercel/analytics](https://vercel.com/docs/analytics) is on every page. Outbound Live / Repo / Install clicks fire named events.
