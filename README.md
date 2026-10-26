# Flychat

A no-login tool: upload a flyer image + your WhatsApp, Telegram, or
Instagram contact, get a link. Visitors see the flyer and one button
straight into a chat with you.

## IMPORTANT: database migration needed before this deploy works

This version adds Telegram/Instagram support, which changed the `flyers`
table. Your Supabase project already has the old schema from before, so
you need to run one migration first:

1. Go to Supabase → SQL Editor
2. Paste and run `supabase/migration-platforms.sql`
3. That's it -- no data is lost, it adds columns and renames one

(If you were setting this up completely fresh instead, you'd just run
`supabase/schema.sql` and wouldn't need the migration file at all.)

## Already set up (don't redo these)

- Supabase project created
- Storage bucket named `flyers`, set to Public
- Vercel project deployed, env vars set:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (the `sb_secret_...` key)
  - `NEXT_PUBLIC_SITE_URL`

## Local development

```
npm install
npm run dev
```

## How it works

- `/` — landing page. The hero headline cycles through "WhatsApp" /
  "Telegram" / "Instagram", cards fade in on load and lift slightly on
  hover, plus a "Where to put your link" section (link in bio, QR on
  flyers/packaging, Stories, SMS)
- `/create` — upload form (drag-and-drop or tap), a platform selector
  (WhatsApp / Telegram / Instagram), then the right field for whichever
  is picked: phone number for WhatsApp, username for Telegram/Instagram.
  The pre-filled message field only shows for WhatsApp and Telegram --
  Instagram's `ig.me` links don't support one, so a note explains that
  instead. After submitting: a live preview card styled for the chosen
  platform, the link (green), the private manage link (black, with a
  warning to save it), and a QR code
- `/api/create` — validates per-platform (phone required for WhatsApp,
  username required for Telegram/Instagram), 4MB upload cap, strips EXIF
  + compresses to WebP via `sharp`, uploads to Supabase Storage,
  generates a unique slug + private manage token, writes the DB row
- `/[slug]` — the public page visitors land on: flyer image, business
  name, a platform-colored button (WhatsApp green, Telegram blue,
  Instagram gradient) with that platform's icon. Below it, a secondary
  "Create your own Flychat link" CTA -- a growth loop for people who
  land on someone else's flyer
- `/manage/[token]` — platform, status, views/taps, QR code, delete. Not
  a login -- the token is a long random string shown once on the result
  screen. No recovery path if it's lost; a deliberate tradeoff of
  staying login-free
- `/qr` — a standalone QR tool, unrelated to the flyer flow: paste any
  link or text, get a downloadable plain QR code. Below it, a **Pro**
  card (custom QR color + embedded logo) -- visibly present but
  disabled/grayed out with a "Coming soon" note. No payment system
  exists yet, so this is UI-only for now: it previews the upsell without
  pretending to actually gate anything

## Multi-platform links

- **WhatsApp** (`wa.me/<number>`) -- phone number, pre-filled message
  supported
- **Telegram** (`t.me/<username>`) -- username only (not phone -- the
  phone-based version only works if the recipient allows lookup-by-number,
  which most people don't), pre-filled message supported
- **Instagram** (`ig.me/m/<username>`) -- username only, Meta's official
  format, works well on mobile, **not supported on Instagram Web**
  (degrades to a profile visit), no pre-filled message support at all
- **X was deliberately left out** -- its DM links need a numeric user ID
  (not the @handle), which most people don't know offhand, and silently
  fail unless the recipient has "message requests from everyone" on.
  Weakest of the four by a wide margin; revisit only if it's clearly
  worth the added friction later

All platform differences (label, which field to show, whether a message
is supported, how the final URL is built) live in one place:
`lib/platforms.js`. Adding a platform later means editing that file plus
wiring its icon into `components/PlatformIcons.jsx` and its button color
into `globals.css` -- nothing else should need to change.

## Layout and design

- `.page` (outer wrapper) is full width with `min-height: 100vh` -- the
  background, header and footer reach edge to edge on any screen size.
  `.page-content` is the centered readable column inside it (480px by
  default, 560px for the flyer image page, 860px for the landing page)
- White background, black is the *default* color for buttons and the
  header/footer; **red only appears on hover/active button states and
  input focus** -- it's an interaction accent now, not a resting color
- Links are green everywhere (`--green`) -- separate from the
  platform-specific brand colors (WhatsApp green, Telegram blue,
  Instagram gradient) used only on each platform's own CTA button
- A subtle animated grid pattern (`components/GridBackground.jsx`) is
  opt-in per page -- landing, create, manage, and the QR tool have it;
  deliberately left off `/[slug]` so that one page stays clean for
  visitors
- Header (`components/Header.jsx`): black background, white version of
  the Dexred Lab logo next to "Flychat", nav links (Home, Create a link,
  QR code). Present on every page including `/[slug]`
- Footer (`components/Footer.jsx`): red Dexred Lab logo + name, email,
  WhatsApp (links to `wa.me`, doesn't dial), X handle, location -- two
  columns, pulled from `lib/siteConfig.js`
- Landing page has entrance animations (cards fade up on load, staggered)
  and a cycling platform name in the hero headline
  (`components/PlatformCycler.jsx`)
- Hero banner (`components/HeroPattern.jsx`) is a full-bleed red field of
  small chat-bubble glyphs -- on-brand rather than a generic shape --
  each with its own animation delay based on row+col position, so the
  fade plays as a diagonal wave rather than random twinkling. A white
  gradient sits on top so hero text stays fully readable regardless of
  where the wave currently is
- Usecase card icons (`components/UsecaseIcons.jsx`) are small line-style
  SVG illustrations, not photographic images -- there's no image
  generation tool available in this environment, so this is the honest
  alternative: on-brand, crisp at any size, no licensing concerns. If
  real photography is wanted later, it'd need to be supplied or
  generated elsewhere and dropped into `public/`
- Header is responsive: below 560px wide, the nav wraps onto its own
  centered row below the brand instead of breaking mid-sentence --
  fixes the disordered wrapping seen on narrower/secondary screens

## Storage limits (Supabase free tier)

- **1GB total file storage** per project. At typical compressed flyer
  sizes (100-300KB after WebP conversion), that's a few thousand flyers
  before needing to upgrade.
- The "50MB" on the bucket's own settings page is a *per-file* ceiling,
  unrelated to the 1GB total, and irrelevant anyway since the app's own
  4MB cap is stricter.
- Free projects **pause after 7 days of no activity** -- one click in
  the dashboard to resume.

## Free-tier feature set

- Random short link for every flyer, any of the three platforms
- Plain QR code, downloadable, for both flyer links and the standalone
  `/qr` tool
- Basic view/click totals
- No account needed anywhere in the flow

**Pro, visually scoped but not functional yet:** custom-color + logo QR
codes (the disabled card on `/qr`). Custom slugs, time-series analytics,
and removing footer branding were discussed earlier as further Pro
candidates -- none of that is built either.

## Still open before a real launch

- No content moderation (DB columns for it exist -- `status`,
  `reports_count` -- but no report endpoint or review flow yet)
- Rate limiting is basic (IP-based, in Postgres), not hardened against
  spoofing
- No privacy policy page yet -- worth having given contact details and
  images are stored (NDPR applies)
- No actual payment/Pro-tier system -- the Pro QR card is a visual
  preview only, nothing is enforced
