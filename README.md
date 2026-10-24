# Flychat

A no-login tool: upload a flyer image + WhatsApp number, get a link. Visitors
see the flyer and one button straight into WhatsApp DM.

## Already set up (don't redo these)

- Supabase project created, `supabase/schema.sql` already run
- Storage bucket named `flyers`, set to Public
- Vercel project deployed, env vars set:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (the `sb_secret_...` key from Supabase's
    newer API key system -- functionally the same as the old `service_role`
    key, just renamed)
  - `NEXT_PUBLIC_SITE_URL`

If any of those ever need to change, they live in Vercel → Settings →
Environment Variables (remember: changes need a Redeploy to take effect).

## Local development

```
npm install
npm run dev
```

## How it works

- `/` — landing page
- `/create` — upload form (drag-and-drop or tap), WhatsApp number, optional
  business name/message. After submitting, shows a live preview card of
  what the public page will look like, the link (green), the private
  manage link (black, with a warning to save it), and a QR code
- `/api/create` — validates the upload (4MB cap, matched to Vercel's own
  ~4.5MB function body limit so people get our error message instead of a
  platform-level one), strips EXIF + compresses to WebP via `sharp`,
  uploads to Supabase Storage, generates a unique slug + private manage
  token, writes the DB row
- `/[slug]` — the public page visitors land on: flyer image, business
  name, a "Chat on WhatsApp" button with the real WhatsApp icon. The link
  preview shown when this URL is pasted into WhatsApp/Instagram pulls the
  actual flyer image via Open Graph tags -- this is already correct in
  code; if a preview ever looks wrong, it's almost always a stale cache
  from testing an old/broken link, not a code issue (each flyer gets a
  brand-new URL, so there's never a pre-existing cache for a new one)
- `/manage/[token]` — stats, QR code, delete. Not a login -- the token is
  a long random string shown exactly once on the result screen. Whoever
  holds that URL can manage that one flyer. No recovery path if it's lost;
  that's a deliberate tradeoff of staying login-free.

## Layout and design

- `.page` (outer wrapper) is full width with `min-height: 100vh` -- the
  background, header and footer reach edge to edge on any screen size.
  `.page-content` is the centered readable column inside it (480px by
  default, 560px for the flyer image page, 860px for the landing page's
  multi-column sections)
- White background, black used for the header/footer, red as the one
  accent on primary buttons (brighter red on hover). WhatsApp green is
  reserved for the WhatsApp button only
- A subtle animated grid pattern (`components/GridBackground.jsx`) is
  opt-in per page -- currently used on the landing, create, and manage
  pages, deliberately left off the public `/[slug]` page so that one
  stays clean for visitors
- Header (`components/Header.jsx`) shows the Flychat name + a small nav
  (Home, Create a link), present on every page including `/[slug]`
- Footer (`components/Footer.jsx`) shows the Dexred Lab logo + name,
  email, WhatsApp (links to `wa.me`, doesn't dial), X handle, and
  location, pulled from `lib/siteConfig.js`. Contact details laid out in
  two columns

## Storage limits (Supabase free tier)

- **1GB total file storage** per project -- the number that actually
  matters long-term. At typical compressed flyer sizes (100-300KB each
  after the WebP conversion), that's a few thousand flyers before
  needing to upgrade.
- The "50MB" shown on the bucket's own settings page is a *per-file*
  ceiling, unrelated to the 1GB total, and irrelevant anyway since the
  app's own 4MB cap is stricter.
- Free projects **pause after 7 days of no activity** -- one click in
  the Supabase dashboard to resume if that happens.

## Free-tier feature set (single system, no paid-tier branching yet)

- Random short link for every flyer
- Plain QR code, downloadable
- Basic view/click totals
- No account needed anywhere in the flow

Custom slugs, branded QR codes, time-series analytics, and removing the
footer branding were discussed as possible Pro-tier additions later --
nothing in this codebase branches on a plan/tier yet.

## Still open before a real launch

- No content moderation (DB columns for it exist -- `status`,
  `reports_count` -- but no report endpoint or review flow yet)
- Rate limiting is basic (IP-based, in Postgres), not hardened against
  spoofing
- No privacy policy page yet -- worth having given phone numbers and
  images are stored (NDPR applies)
