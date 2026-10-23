# Flychat — starter

A no-login tool: upload a flyer image + WhatsApp number, get a link. Visitors
see the flyer and one button straight into WhatsApp DM.

This is a working MVP scaffold, not a finished product — see "Still open"
at the bottom for what to decide on before launching for real.

## 1. Create a Supabase project

1. Go to supabase.com, create a free project.
2. In the SQL editor, paste and run `supabase/schema.sql` from this repo.
3. Go to Storage → Create a new bucket called `flyers`. Set it to **Public**.
   Do not add a public insert policy — uploads should only ever happen
   through the server (service role key), which bypasses storage RLS.
4. Go to Project Settings → API. Copy the **Project URL** and the
   **service_role** key (not the anon key — this app never uses the anon key).

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the two Supabase values.

## 3. Footer details

`lib/siteConfig.js` is already filled in with the real Dexred Lab branding
(logo, email, WhatsApp, X handle, location) — the footer on every page
pulls from this one file. If any of those details change later, this is
the only place to edit.

The footer logo (`public/dexred-lab-logo.png`) was extracted from a photo
of your logo on screen, background removed and recolored to match the
site's red. It's fine for a footer at ~22px tall, but it's not a vector —
if you get an actual SVG/PNG export of the Dexred Lab logo later, swap it
into `public/` and it'll look sharper at any size.

## 4. Run locally

```
npm install
npm run dev
```

Visit http://localhost:3000.

## 5. Deploy to Vercel

1. Push this to a GitHub repo, import it into Vercel.
2. Add the same environment variables in Vercel's project settings
   (Settings → Environment Variables).
3. Set `NEXT_PUBLIC_SITE_URL` to your real production URL once you have a domain.
4. Deploy.

## How it works

- `/` — landing page
- `/create` — the upload form (POSTs to `/api/create`)
- `/api/create` — validates the upload, strips EXIF + compresses the image
  via `sharp`, uploads it to Supabase Storage, generates a unique slug and a
  private manage token, inserts the DB row
- `/[slug]` — the public flyer page. Renders Open Graph tags server-side
  (so the image shows up when the link is shared elsewhere) and the
  "Chat on WhatsApp" button
- `/manage/[token]` — stats, QR code, and delete, reachable only with the
  private token handed back at creation time. **This is not a login.**
  There's no username/password anywhere. The `[token]` in that URL is a
  long random string generated once in `/api/create` and shown to the
  creator exactly once, on the result screen, with a warning to save it.
  Whoever has that specific URL can manage that one flyer — nothing else
  gates it. It's closer to a "secret link" (like a Google Doc share link)
  than an account system. The tradeoff: if someone loses that link, there
  is currently no recovery path (no email lookup, nothing) — that's worth
  deciding on deliberately rather than treating as a bug.
- `components/QrCode.jsx` — generates a plain QR code client-side for any
  flyer link; shown on both the result screen and the manage page. This is
  the free-tier version by design — a branded/colored QR with a logo is a
  natural upgrade of this same component later, not built yet

## Layout

`.page` (the outer wrapper in every route) is full width with
`min-height: 100vh`, so the background and the black footer reach edge to
edge and fill the full browser window on any screen size — it no longer
looks like a narrow fixed-width card floating in empty space on a desktop
monitor. The actual readable content (`.page-content`) is still centered
with a sensible max-width (480px, 560px for the flyer image page) so text
and forms don't stretch uncomfortably wide — that part is deliberate, not
a leftover constraint.

## Free-tier feature set (all in this one app, no separate plan logic yet)

- Random short link for every flyer
- Plain QR code, downloadable as a PNG
- Basic view/click totals on the manage page
- No account needed anywhere in the flow

Custom slugs, branded QR codes, and time-series analytics were discussed as
possible Pro-tier additions later, but nothing in this codebase branches on
a plan/tier yet — this is intentionally a single, undifferentiated system
for now.

## Still open — read this before treating it as launch-ready

These were flagged in the planning conversation and are intentionally not
solved yet in this scaffold:

- **Content moderation.** There's no image moderation at all right now.
  At minimum, add a "report this link" button that flags a flyer for
  manual review (the `reports_count` / `status: 'flagged'` columns are
  already there for this — just need the endpoint and a review step).
- **Rate limiting is IP-based and naive.** Fine to start, but spoofable.
  Upstash Redis (also free-tier friendly, pairs well with Vercel) is the
  natural upgrade if abuse becomes a problem.
- **No slug collision handling beyond 5 retries.** Fine at low volume;
  revisit if this gets popular.
- **No privacy policy page yet.** Needed before real launch, given this
  stores phone numbers and images — NDPR (Nigeria) applies.
- **wa.me in-app browser behavior** (opening from inside WhatsApp status,
  Instagram bio, etc.) should be tested on real devices before launch —
  in-app webviews sometimes behave differently with deep links than a
  normal mobile browser.
