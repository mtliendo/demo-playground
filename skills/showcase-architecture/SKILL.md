---
name: showcase-architecture
description: Draft an architecture diagram for an Auth0 Showcase demo using the Excalidraw or tldraw canvas MCP, then save it in the source repo at docs/architecture.png (or .svg).
---

# Showcase architecture diagram

Auth0 Showcase does not author diagrams. The **source demo repo** does. The catalog page renders whatever is on `main` at the path in the demo’s frontmatter (`architecture`, default `docs/architecture.png`).

## Convention

1. Create `docs/` in the **demo repository**, not in `demo-playground` unless you are only testing.
2. Save the diagram as `docs/architecture.png` or `docs/architecture.svg`.
3. Keep it one screen: actors, Auth0, the app, and the third-party grant (Token Vault, CIBA, Guardian). No clip-art.
4. After it is on `main`, the Showcase empty state goes away on the next fetch (cached ~1 hour).

## How to draft it

If an Excalidraw or tldraw MCP (or Cursor canvas) is available:

1. Open a blank canvas.
2. Draw the happy path left to right. Label Auth0 products by name (Universal Login, Token Vault, CIBA, Guardian).
3. Export PNG or SVG.
4. Write the file to `docs/architecture.png` in the demo repo and open a PR there.

If no canvas MCP is available, produce a clear mermaid `flowchart LR` in chat, then ask the human to export it to `docs/architecture.png`. Do not invent a diagram studio inside Showcase.

## What good looks like

- CIBA Email and Hero Shield should **rhyme**: same grant shape, different labels (one user vs a seated board + calendar).
- Party Animals: player → Auth0 → game → optional Token Vault → GitHub.
- Trip Planner: one booking flow, four interruption types stacked, not four apps.
- AWS Service Heroes: booth device (fast still) vs completion path (Token Vault after they leave).

## Do not

- Put the diagram only in Showcase `public/`.
- Point frontmatter at a localhost path.
- Block publishing a Showcase card if the file is missing — the catalog shows an empty state instead.
