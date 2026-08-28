# Design System: Auth0 Showcase

> Auth0's voice, a catalog's job.
>
> The audience is developer advocates and engineers picking a demo to run in the next hour.
> Every decision should make the *content* louder and the *chrome* quieter.

Tokens below were sampled from `auth0.com` (2026-08-28) — hex values, gradient stops,
radii, and font stack are the real ones, not approximations.

---

## 1. Principles

1. **The catalog is the page.** Hero copy earns its space or it goes. One idea per screen.
2. **Chrome recedes.** Borders, labels, and metadata are tertiary. If everything is
   emphasized, nothing is.
3. **Mono is for code.** Auth0 uses monospace in terminals and one pill badge — nowhere else.
   Uppercase-mono-letterspaced-everything is the single biggest "generic dev tool" tell.
4. **Purple is a signal, not a wash.** One accent per view. The orange→purple gradient is a
   1px rule, never a fill.
5. **Rectangles, not pills.** Auth0's buttons are 4–6px radius. Cards are 12px.

---

## 2. Color

Sampled from auth0.com. All ratios measured against `--bg` (`#120021`).

### Surfaces
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#120021` | Page background. Auth0's near-black purple. |
| `--bg-elevated` | `#1b0630` | Header, inputs, hover surfaces. |
| `--bg-card` | `#20003a` | Cards, panels, code blocks. |
| `--bg-sunken` | `#0c0016` | Terminal / pre blocks. |

### Lines
| Token | Value | Usage |
|-------|-------|-------|
| `--line` | `rgba(212,161,255,0.14)` | Default hairline. Purple-tinted, never neutral gray. |
| `--line-strong` | `rgba(212,161,255,0.30)` | Hover and focus borders. |

### Text
| Token | Value | Contrast on `--bg` | Usage |
|-------|-------|-----|-------|
| `--ink` | `#fffefa` | 18.9:1 | Headings, primary text. Auth0's warm off-white — not pure `#fff`. |
| `--ink-muted` | `#c9bad8` | 10.6:1 | Body copy, descriptions. |
| `--ink-faint` | `#9585a8` | 5.8:1 | Metadata, captions, timestamps. Never body copy. |

### Accent
| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#9921fe` | Auth0 purple. Fills only (buttons, active states). Too dark for text on `--bg`. |
| `--accent-hover` | `#bc6dff` | Button hover. |
| `--accent-ink` | `#d4a1ff` | **Purple as text.** 8.1:1 on `--bg`. Use this, never `--accent`, for type. |
| `--accent-soft` | `rgba(153,33,254,0.16)` | Active chip / tab backgrounds. |
| `--accent-deep` | `#490186` | Gradient tail, decorative only. |

### Signals
| Token | Value | Usage |
|-------|-------|-------|
| `--signal` | `#ff6217` | Auth0 orange. **Gradient rule only.** Never a standalone accent — it fights the purple. |
| `--mint` | `#96ffbb` | "Live" state. Auth0 uses it for terminal success lines. |

### The brand gradient
```css
linear-gradient(90deg, #ff6217 2%, #9921fe 52%, #490186 97%)
```
Auth0's signature. Used as a **1px rule under the header** and nowhere else on a given page.
Applying it as a background fill is off-brand and reads as a 2019 SaaS template.

### Banned
- Purple gradients as section backgrounds (the cliché the real Auth0 site avoids on interior pages).
- Neutral gray borders (`#333`, `border-white/10`). All lines carry purple tint.
- Orange as a text or icon color.

---

## 3. Typography

Auth0 ships **Aeonik** + **Aeonik Mono** (proprietary). Closest free equivalents:

| Role | Font | Why |
|------|------|-----|
| Display + body | **Figtree** | Geometric grotesque, circular bowls, single-story `g`. Closest Google Font to Aeonik. One family for everything. |
| Mono | **Roboto Mono** | Auth0 literally ships `roboto-mono` in their own font CDN. |

**No serif.** The previous Fraunces display face read editorial/magazine — wrong genre for an
identity platform.

### Scale
| Element | Size | Weight | Tracking | Leading |
|---------|------|--------|----------|---------|
| Page H1 | `clamp(2.75rem, 6vw, 4rem)` | 400 | `-0.035em` | 1.02 |
| Section H2 | `1.5rem` | 500 | `-0.02em` | 1.2 |
| Card title | `1.25rem` | 500 | `-0.015em` | 1.25 |
| Body | `1rem` / `1.0625rem` | 400 | `0` | 1.65 |
| Meta | `0.8125rem` | 400 | `0` | 1.4 |
| Code | `0.8125rem` mono | 400 | `0` | 1.6 |

**Large headlines run at weight 400, not bold.** Auth0's hero is light-weight at huge size —
that restraint is the whole look. Bold + huge reads as a landing-page template.

### Case
Sentence case everywhere. The only `uppercase` on the site is the eyebrow label above an H1
(one per page, `0.75rem`, `0.18em` tracking, `--accent-ink`).

---

## 4. Space & Shape

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | Buttons, inputs, chips, tabs. |
| `--radius` | `12px` | Cards, panels, figures. |

Spacing scale: 4 / 8 / 12 / 16 / 24 / 40 / 64 / 96px. Section rhythm is `64px` between
sections, `96px` after the hero.

Container widths — pick one and hold it:
- Catalog / index pages: `max-w-6xl` (1152px)
- Detail / reading pages: `max-w-3xl` (768px), body copy caps at ~70ch

---

## 5. Motion

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease:     cubic-bezier(0.4, 0, 0.2, 1);
```

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button press (`scale(0.98)`) | 120ms | `--ease-out` |
| Hover color / border | 160ms | `--ease` |
| Card hover | 200ms | `--ease` |
| Card entrance stagger | 320ms, 40ms apart | `--ease-out` |

Rules:
- Only animate `transform`, `opacity`, `color`, `border-color`, `background-color`.
- Never `transition: all`.
- Never `ease-in` on UI.
- Nothing over 320ms.
- Hover transforms sit behind `@media (hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion` kills movement, keeps opacity and color.

---

## 6. Components

### Buttons
Radius `6px`, min-height `44px`, sentence case, weight 500.
- **Primary**: `--accent` fill, `--ink` text, hover `--accent-hover`.
- **Secondary**: `--line` border, transparent, hover `--line-strong` + `--bg-elevated`.
- All get `:active { transform: scale(0.98) }`.

Never `rounded-full` for actions. Pills are for filter chips only.

### Cards
`--bg-card` on `--radius`, `--line` border. Hover: border → `--line-strong`, background →
`--bg-elevated`. No lift, no shadow, no scale (layout shift in a grid).

Card content ceiling: **kind label · title · one line of description · one metadata row.**
Anything else belongs on the detail page.

### Chips (filters, topics)
`rounded-full`, `--line` border, `--ink-muted`. Active: `--accent` border, `--accent-soft`
fill, `--ink` text. Sentence case, `0.8125rem`.

### Focus
`outline: 2px solid var(--accent-ink); outline-offset: 2px` on every interactive element.
Never `outline: none` without a replacement.

---

## 7. Page budgets

Hard ceilings. If a page exceeds these, cut — don't shrink the type.

| Page | Budget |
|------|--------|
| Home hero | Eyebrow + H1 + **one** sentence. No third paragraph. |
| Catalog filters | **One row of topic chips.** No type toggle (the nav's Demos/Skills pages do that job), no search until >25 entries, no result count. |
| Card | 4 elements (see above). |
| Demo detail | **4 sections**: hero → experience (+architecture) → run it → related. Frontmatter fields group into these; they do not each get a heading. |
| Skill detail | **3 sections**: hero → install → stories. |

Metadata that is not load-bearing (`seenAt`, `stack`, related repos) lives inline in a
definition row, not as its own H2 with 40px of air above it.

**Header.** Gradient mark, a two-line lockup (`Auth0 DevRel` eyebrow over `Demo Library`), two
destinations, and Submit. A "Catalog" link would duplicate the wordmark, and at 390px the extra
link pushes Submit off the viewport. Verified by harness, not by eye.

**Actions are orange.** `--signal` fills the Repository button and the header's Submit. Repository
is the one action every entry has, so it outranks Live demo (`--accent`). This overrides the
gradient-only rule for orange in §2: orange is now the action color, still never a section fill.

**Screenshots.** Demo cards and detail pages carry real screenshots of the running app, captured
by `scripts/shoot-demos.mjs`. Files live at `public/shots/<slug>/NN-label.webp` and the model
reads the directory, so adding a screenshot is dropping a file in. First file is the card
thumbnail. Capture at exactly 16:10 or `object-cover` crops the sides.

---

## 10. Verification

`node scripts/shoot.mjs [baseUrl] [outDir]` screenshots every route at 390/834/1440 against a
running dev server. Zero dependencies: it drives system Chrome over CDP using Node's built-in
`WebSocket` (`scripts/lib/cdp.mjs`). Run it before claiming any visual change works. Reading the
HTML is not a substitute; the mobile header overflow that shipped in the first pass was invisible
in markup.

`node scripts/shoot-demos.mjs` captures the demo screenshot sets from `scripts/demo-targets.json`.
It gates every capture before writing, because a screenshot succeeding proves nothing on its own:

- Pages matching an auth/error pattern, or with under 40 characters of copy, are rejected. Demo
  apps booted on placeholder credentials render an error page on every gated route.
- A capture byte-identical to an earlier one in the same set is rejected. A scroll past the page
  bottom silently re-shoots the previous view.

Both checks exist because both bugs shipped "ok" before the gate was added. A `SKIP` line in the
output is the harness working, not failing.

---

## 8. Accessibility

- 4.5:1 minimum on all text (table in §2 is measured, use it).
- 44×44px minimum touch targets.
- Color is never the only signal — "Demo" vs "Skill" carries a text label, not just a hue.
- Every image has alt text; every icon-only control has `aria-label`.
- Tab order matches visual order; skip link is first in the DOM.

---

## 9. Trademark

This is **not an official Auth0.com property**. Use Auth0's palette and typographic
character; do **not** reproduce the Auth0 shield logo or wordmark. The header is typographic
plus the gradient rule.
