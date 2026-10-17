# Legacive Barber Studio — website

Single-file site for **Legacive Barber Studio**, 24 Brock Street W, Uxbridge, Ontario · (289) 988-5515 · appointments only.

## Files
- `index.html` — the whole site. HTML, CSS, JS, every photo, both videos, favicon and the Nexlyr credit are embedded in this one file. Nothing else to upload.

## What's inside
- Preloader: the hero reel plays inside the LEGACIVE letters, then the camera dives through the I
- Hero: the studio's hexagon-light ceiling video with a drawn hex cluster
- Interactive background: a Three.js faceted black wall (like the studio's 3D panels) lit by the cursor, with floating hex LED outlines
- Services menu with live photo preview (tap a service to start booking with it chosen)
- Zoom-out mosaic wall, 3D drag ring gallery + lightbox, pinned hex ceiling, horizontal "how a visit goes" tour, hex-framed reel, sticky stack, story, visit + map, socials
- Booking request form (service · day · time · details) with a live ticket summary
- Rule-based chatbot with the shop's real info
- Smooth scroll (Lenis) + GSAP ScrollTrigger animations, reduced-motion support

## Booking form → Supabase (optional)
Out of the box the form sends the request to the studio by text (pre-filled SMS) and also points to Booksy.
To store requests in Supabase, create this table and paste the project URL + anon key into `SUPABASE_URL` / `SUPABASE_ANON_KEY` in `index.html`:

```sql
create table bookings (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  service text not null, day date not null, time text not null,
  name text not null, phone text not null, email text, note text, source text
);
alter table bookings enable row level security;
create policy "website can insert" on bookings for insert to anon with check (true);
```

## To confirm with the client
- **Prices** on the menu are a guide (Skin fade $45, Haircut $40, Cut + beard $55, Beard & line-up $25, Kids $30, VIP $90, Design +$10). Swap in the real Booksy prices.
- **Time slots** in the form (10 AM – 7 PM) — set to the real hours.
- **Instagram and Facebook links** — the Instagram handle was cut off in the screenshot (`legacive_barberstudio.u…`); currently linked as `legacive_barberstudio.uxbridge`. Facebook is linked as `Legacive.barbershop`. TikTok `@legacive.barbershop` is confirmed.
- A real logo file, if the shop has one (the site uses a hex "L" mark for now).

## Deploy
Vercel: import this repo (Framework preset **Other**, no build command). Or GitHub Pages from `main` / root.

Site by Nexlyr Solutions — nexlyr.solutions
