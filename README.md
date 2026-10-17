# Legacive Barber Studio — website

Multi-page site for **Legacive Barber Studio**, 24 Brock Street W, Uxbridge, Ontario · (289) 988-5515 · appointments only.

## Pages
| File | Page |
|---|---|
| `index.html` | Home: intro, hero showreel, menu teaser, mosaic wall, 3D ring gallery, reel, sticky stack |
| `services.html` | Menu board with live photo preview, price cards, how a visit goes, FAQ |
| `gallery.html` | 3D drag ring, filterable photo grid (fades / curly / designs / beard), video wall |
| `about.html` | AK's story, timeline, pinned hex-ceiling studio section |
| `book.html` | Booking request form (service · day · time · details) with live ticket |
| `contact.html` | Call / Booksy / directions cards, map, Uxbridge clock |

## Files
```
assets/css/style.css      all styles
assets/js/data.js         prices, services, time slots, gallery list, contact info  ← edit here
assets/js/main.js         all interactions and animations (shared by every page)
assets/img/               photos, logo (AK), video posters
assets/video/             showreel + page clips
assets/vendor/            GSAP, ScrollTrigger, Lenis, Three.js (local copies, no CDN)
favicon.png, apple-touch-icon.png
vercel.json               long caching for /assets
```

## Speed
- Scripts are deferred; the 3D background (Three.js) loads after the page is shown and fades in.
- Videos stream (`faststart`), play only while on screen, and show a poster instantly.
- The home intro runs about 2 seconds, once per visit; other pages open with a short hex wipe.

## Booking form → Supabase (optional)
By default a request opens a pre-filled text to the studio, with Booksy as the instant option.
To store requests, create the table below and add your project URL + anon key to `supabaseUrl` / `supabaseKey` in `assets/js/data.js`:

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
- **Prices** in `data.js` are a guide (Skin fade $45, Haircut $40, Cut + beard $55, Beard & line-up $25, Kids $30, VIP $90, Design +$10).
- **Time slots** (10 AM – 7 PM) in `data.js`: set to real hours.
- **Facebook** link is a best guess (`Legacive.barbershop`). Instagram `legacive_barberstudio.uxbridge` and TikTok `@legacive.barbershop` match the shop's profile.

## Deploy
Vercel: import this repo (Framework preset **Other**, no build command, output = root).

Site by Nexlyr Solutions — nexlyr.solutions
