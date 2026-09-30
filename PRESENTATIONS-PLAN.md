# Presentations section for Auth0 Showcase

## Context

The catalog currently has two content kinds — Demos and Skills — each following the same
pattern: a Markdown file in `content/<kind>/*.md` parsed by `lib/content.ts`, a typed shape in
`lib/types.ts`, an index page, a detail page, and a GitHub issue template for submissions. The
user wants a third kind, **Presentations**, for conference/booth talk decks that pair with the
existing demos: a slide deck, a talk script, and a time-to-complete.

**Revision history on this plan:**

1. The original design embedded Google Slides via an `<iframe>`, pointed at a "Publish to web"
   URL. That was abandoned after the user reported their company's security policy prohibits
   "Anyone with the link" sharing on Google Slides — a public, "Publish to web" deck is exactly
   what that policy blocks.
2. In response, the plan moved to a Marp-based pipeline: Markdown decks rendered at build time
   to static PNGs checked into `public/slides/`, with zero third-party dependency at request
   time. This fully sidestepped the sharing-setting problem by removing Google Slides from the
   architecture entirely.
3. **This revision reverses that.** The user talked to the stakeholder directly about the Google
   Slides limitation, and the decision for this iteration is: **keep Google Slides, restrict
   sharing to the organization so the embed only resolves for Okta-authenticated viewers.**
   Concretely, the deck is shared as "Anyone in `<org>` with the link" (or a Group-restricted
   equivalent) rather than "Anyone on the internet with the link" — Google Workspace access is
   federated through Okta SSO, so an unauthenticated or external visitor hitting the embedded
   iframe sees Google's sign-in/request-access screen, not the deck. Nothing in the Next.js app
   performs the auth check; the gate is entirely Google's sharing ACL. This is a deliberate,
   accepted scope reduction for this iteration — Presentations will not be viewable by anonymous
   or external visitors to what is otherwise a fully public catalog. That tradeoff is documented
   below rather than hidden.

## Architecture: link out to Google Slides, org-restricted sharing

**No iframe.** An embedded iframe assumes the visitor can see the content inline once loaded;
with org-restricted sharing, a visitor who isn't signed into an Okta-linked Google account still
hits Google's "request access" screen either way — embedding that screen inside our page's
chrome just makes it look broken, and it forces us to guess at `sandbox`/`allow` attributes for
no benefit. Google's own access-request page already handles this UX correctly on its own tab.
So instead of embedding, the detail page **links out**: a button that opens the deck in a new
tab, labeled plainly about the restriction — e.g. **"Open slides (Okta employees only)"** — so
the limitation is stated at the point of action, not discovered after clicking into a broken
embed.

1. **Canonical source of the deck**: a Google Slides file, owned and shared by whoever authors
   the talk, **not** checked into this repo. Sharing must be set to the organization (Okta-
   federated Google Workspace), never "Anyone with the link" — that setting is the one the
   security policy prohibits, and reintroducing it would repeat the original mistake.
2. **What lives in this repo**: `content/presentations/<slug>.md` — a flat Markdown file (same
   shape as `content/demos/*.md` and `content/skills/*.md`, not a per-slide subdirectory —
   there's no per-slide asset to key a directory off anymore). Frontmatter carries the catalog
   metadata (title, oneLiner, topics, author, repo, timeToComplete, seenAt, seeAlso) plus
   `slidesUrl`, the deck's normal Google Slides URL (the `.../edit` or `.../view` link you'd
   share directly — not an embed URL, since nothing embeds it). The Markdown body is the talk
   script/notes, written as plain prose or `##`-per-section, same role as a Demo's `experience`
   section.
3. **Runtime**: the detail page renders a single link/button pointing at `slidesUrl`, opened via
   `TrackedLink` with `target="_blank"` (already the convention for external links in this repo).
   No render step, no static images, no `scripts/render-slides.mjs`, no `marp-cli` dependency —
   all of that from the Marp revision is removed, and no iframe/sandbox component is added in its
   place either.
4. **Visible "this is gated" signal**: because every other part of this catalog is genuinely
   public (per the README, "public catalog of Auth0 demos") and this section quietly is not, the
   UI must say so plainly. The button's own label carries this ("Okta employees only"), backed up
   by a small "Slides: Okta only" badge on the Presentations card and detail-page hero (see Components
   below) so the limitation is visible before a visitor even reaches the button. This is the one
   place in the site where "reusable regardless of internal or external audience" — the original
   stated goal — is *not* true for this iteration, and that limitation is stated in the UI, not
   just in this doc.
5. **"Take this and reuse it" action**: same role as a Demo's `Repository` button, and now the
   *same* button as the slides link above — since the deck lives in Google Slides (not in git),
   opening it via the "Open slides" button already lets anyone who can see it duplicate it into
   their own Drive from there (File → Make a copy). The existing `repo` link stays as a second,
   separate action for whatever code/companion repo goes with the talk. No PPTX export tooling
   needed; that concern doesn't arise since the canonical copy already lives in Slides.

This also means the "public git history" tension from the Marp revision goes away for
Presentations specifically — the deck content itself is never committed, only metadata and a
link. The tradeoff moves from "is the file public" to "is the embed viewable," which is the
Okta-gate limitation described above.

## Data model

### Shared base type (unchanged from prior revision)

`Demo` and `Skill` already both carry `slug`, `title`, `oneLiner`, `topics`, `author`, `repo`.
Extract this once, as a third kind now justifies it:

```ts
export type CatalogEntryMeta = {
  slug: string;
  title: string;
  oneLiner: string;
  topics: Topic[];
  author: Author;
  repo: string;
};
```

`Demo`, `Skill`, and `Presentation` become `CatalogEntryMeta & { kind: "..."; ...rest }` —
type-only refactor, no change to existing content files. `lib/content.ts` gets a matching
`parseCatalogEntryMeta(slug, data)` helper used by all three `parse*` functions (including
retrofitting `parseDemo`/`parseSkill`, so the DRY fix is consistent, not just additive).

### Presentation-specific type

Add to `lib/types.ts`:

```ts
export type Presentation = CatalogEntryMeta & {
  kind: "presentation";
  timeToComplete: string;  // "15–20 minutes", same free-text convention as timeToStandUp
  seenAt: string[];
  seeAlso: string[];       // slugs, cross-links to demos or other presentations
  slidesUrl: string;       // Google Slides view/edit URL — org-restricted sharing, Okta-gated,
                           // opened via an "Open slides (Okta employees only)" link, not embedded
  talkTrack: string;       // Markdown body: the presenter's script/notes
};
```

No `PresentationSlide`/`slides[]` array — per-slide images and per-slide captions only made
sense when slides were rendered to static PNGs. With Google Slides as the source of truth, the
deck's own slide notes live in Google Slides itself; `talkTrack` here is the higher-level script
a presenter reads alongside the deck, same granularity as a Demo's `experience` field.

`CatalogItem.kind` widens to `"demo" | "skill" | "presentation"`. No separate `gated` field is
added — that would duplicate what `kind` already tells you, the same drift risk the plan is
already fixing for `catalog.tsx`'s `isDemo` boolean below. Wherever the gate badge needs to
render, derive it inline: `item.kind === "presentation"`.

## Content parsing — `lib/content.ts`

- `content/presentations/<slug>.md` frontmatter shape:
  ```yaml
  title: Example Presentation
  oneLiner: ...
  topics: [ai-agents]
  author: { name: ..., github: ... }
  repo: https://github.com/...
  timeToComplete: 15–20 minutes
  seenAt: []
  seeAlso: []
  slidesUrl: https://docs.google.com/presentation/d/REPLACE_ME/edit
  ---
  (Markdown talk script/notes — the body, same role as a Demo's `experience` section)
  ```
- Add `parsePresentation(slug, data, body)`: builds `CatalogEntryMeta` via the shared helper,
  reads `timeToComplete`/`seenAt`/`seeAlso`/`slidesUrl` from frontmatter, and takes `body` as
  `talkTrack` verbatim (same pattern as `Skill.synopsis`).
- `readMdFiles("presentations")` works unchanged — flat `<slug>.md` files, no directory-per-entry
  variant needed now that there's no per-slide image directory to key off.
- Add `getPresentations()`, `getPresentation(slug)` following `getDemos`/`getDemo`.
- Extend `getCatalogItems()` to append a third mapped array for presentations (kind
  `"presentation"`, `href: /presentations/${slug}`, `timeToStandUp: presentation.timeToComplete`,
  no `thumbnail` — there's no rendered image to use as one, same as `Skill` today).

## Routes

- `app/presentations/page.tsx` — copy `app/demos/page.tsx` structure verbatim (filter
  `getCatalogItems()` by `kind === "presentation"`, same `CatalogPage` usage). Hero copy e.g.
  "Talk tracks for the room" / "Slides, script, and how long it takes," with a one-line note
  under the hero that this section requires an Okta-linked Google sign-in to view the decks.
- `app/presentations/[slug]/page.tsx` — modeled on `app/demos/[slug]/page.tsx` but sized like
  the Skill-detail page (per DESIGN.md's page-budget discipline — 3–4 sections):
  1. Hero (eyebrow "Presentation", title, oneLiner, author/seenAt line, topics chips, gated
     badge — see Components)
  2. Talk track — render `talkTrack` via the existing `Markdown` component
  3. Run it — time to complete, **"Open slides (Okta employees only)"** button (`slidesUrl`,
     via `TrackedLink`/`btnBrand`, `target="_blank"`) and `repo` link, side by side
  4. See also — reuse the existing `seeAlso`/related-repo rendering pattern from the demo page

No dedicated slide-viewing component (no `GoogleSlideEmbed`, no `slide-deck.tsx`, no iframe at
all) — the slides button is just a `TrackedLink` styled with the existing `btnBrand` class, same
as any other external CTA on a Demo page (e.g. its `Live demo` button). One line under the
button, in `--ink-faint`, states the access note directly: "Opens in Google Slides. Requires
signing in with your Okta-linked Google account — if you land on a request-access screen, ask
{author} to confirm your access." This is the direct mitigation for the "confusing dead link"
risk, in place of what would otherwise have been an iframe fallback message.

## Gated badge — `components/catalog.tsx`

- `CatalogCard`'s kind label needs a third branch (derive from `item.kind`, not a boolean):
  `item.kind === "demo" ? "Demo" : item.kind === "skill" ? "Skill" : "Presentation"`.
- When `item.kind === "presentation"`, render a small secondary badge next to the kind label —
  e.g. a lock glyph + "Slides: Okta only" in `--ink-faint`, same visual weight as the existing
  "Live" mint-dot treatment, so it reads as metadata, not an error state. (Label scoped to the
  slides specifically, not "Internal" — the page itself is public; only the linked deck is
  gated.)
- Same badge repeated on the presentation detail page hero (not just the card), since a visitor
  who navigates straight to a presentation URL (shared link, search result) may skip the index
  page entirely.

## Navigation & site copy

- `components/site-header.tsx`: add `{ href: "/presentations", label: "Presentations" }` to the
  `nav` array.
- `lib/topics.ts`: no changes — presentations reuse the existing closed topic set.

## Submission path

- New `.github/ISSUE_TEMPLATE/submit-presentation.yml`, modeled on `submit-demo.yml`: title,
  oneLiner, repo, topics (reuse same closed dropdown list), timeToComplete, author, `slidesUrl`,
  and a textarea for the talk track.
- Add an explicit markdown callout at the top of the template (same spot `submit-demo.yml` uses
  for its architecture-path note): "Share the Slides deck with the organization (Share → General
  access → `<org>`), **not** 'Anyone with the link.' This section is only viewable by
  Okta-authenticated teammates in this iteration — an externally-shared link defeats that and
  will be sent back for re-sharing."
- `app/submit/page.tsx`: add a third option object (`submit-presentation.yml`, kind
  "Presentation") to the `options` array — grid is `sm:grid-cols-2`; let a third card wrap to
  its own row.

## Seed content — placeholder only

One entry: `content/presentations/example-placeholder.md` with obviously placeholder frontmatter
(`title: "Example Presentation (replace me)"`, `slidesUrl` pointing at a placeholder Google
Slides doc ID with a comment that it must be replaced with a real org-shared deck before this
stops being a placeholder). Note: an actual Okta-gated Google Slides doc can't be created from
this repo/session — whoever wires this up for real needs to create the deck, set sharing to the
organization, and paste the resulting URL in. Until then, clicking the placeholder's "Open
slides" button will land on Google's own "you need access" page for everyone, including internal
viewers, since the placeholder ID isn't a real shared doc — that's expected and should be called
out in the PR description, not treated as a bug to fix here. Also worth stating in that PR
description: the button performs no access check itself (see note above) — clicking through
always succeeds as a navigation, and it is Google's sharing ACL, not this app, that determines
whether the destination actually shows the deck.

## Files touched

- `lib/types.ts` — add `CatalogEntryMeta`, `Presentation`; retrofit `Demo` and `Skill` to
  compose `CatalogEntryMeta`; widen `CatalogItem.kind`
- `lib/content.ts` — add `parseCatalogEntryMeta` helper (used by all three `parse*` functions);
  add `parsePresentation`, `getPresentations`, `getPresentation`; extend `getCatalogItems`
- `lib/topics.ts` — no change (confirms reuse)
- `components/site-header.tsx` — add nav entry
- `components/catalog.tsx` — 3-way kind label + gate badge (derived from `kind`, no new field)
- `app/presentations/page.tsx` — new
- `app/presentations/[slug]/page.tsx` — new
- `app/submit/page.tsx` — add third option
- `.github/ISSUE_TEMPLATE/submit-presentation.yml` — new
- `content/presentations/example-placeholder.md` — new, placeholder seed

Removed relative to earlier revisions — no longer needed:
- From the Marp revision: `scripts/render-slides.mjs`, `@marp-team/marp-cli` devDependency,
  `public/slides/`, `slideImagesFor`/`readSlideDecks`, `PresentationSlide` type,
  `components/slide-deck.tsx`.
- From the iframe-embed revision: no `components/google-slide-embed.tsx` — the detail page uses
  a plain `TrackedLink` button instead, no dedicated component needed.

## Verification

1. `pnpm lint` and `pnpm build` (or `tsc --noEmit`) to confirm new types/routes compile and
   `generateStaticParams` resolves for the new dynamic route.
2. `pnpm dev`, then per DESIGN.md's own rule ("Reading the HTML is not a substitute"), drive the
   real browser:
   - Visit `/presentations` — confirm the placeholder card renders with the "Slides: Okta only" badge,
     topic filter still works across all three kinds from `/`.
   - Visit `/presentations/example-placeholder` — confirm the "Open slides (Okta employees
     only)" button renders, links to `slidesUrl`, and opens in a new tab (clicking it will land
     on Google's access-denied/sign-in state with the placeholder URL — expected, see Seed
     content above); confirm the access-note line under the button, talk track, and repo link
     all show correctly.
   - Confirm header nav shows "Presentations" and highlights active state on that route.
   - Check `/submit` for the third card, correct issue-template link, and that the new template
     renders the org-sharing callout.
   - Run `node scripts/shoot.mjs` to catch any mobile-width overflow per the project's own
     verification discipline in DESIGN.md.
3. **Cannot be verified from this environment**: actual Okta-gated access behavior (i.e., does a
   signed-in org member really see the deck, does an external visitor really get blocked). That
   requires a real Google Slides doc shared to the org and a manual check from both an
   authenticated and an unauthenticated browser session — flag this explicitly to whoever reviews
   the PR rather than asserting it works from an automated check.
