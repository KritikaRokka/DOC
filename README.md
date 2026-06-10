# DOS Curaçao — RFID Workforce Platform · PP-1 Hero

Premium technology platform hero section. HTML + Tailwind (CDN) + GSAP.

---

## Folder Structure

```
dos-curacao-platform/
├── index.html              ← PP-1 hero (open this in a browser)
├── css/
│   └── hero.css            ← custom styles, glows, pulses, grain
├── js/
│   └── hero.js             ← GSAP entrance + product loop + parallax
├── assets/
│   ├── videos/             ← hero background + demo videos
│   ├── images/             ← poster frames, photos
│   ├── renders/            ← AI product renders (phone, RFID reader)
│   └── logos/              ← DOS logo, Red Team mark
└── README.md
```

---

## How to View

Just open `index.html` in any browser. No build step, no server needed.
(Tailwind + GSAP load from CDN.)

---

## Deploy to Vercel

This is a static site (HTML + CSS + JS). No build step is required.

**Option A — Vercel Dashboard (GitHub/GitLab/Bitbucket)**

1. Push this repo to your Git provider.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Set **Root Directory** to `dos-curacao-platform` (the folder that contains `index.html`).
4. Leave **Framework Preset** as *Other* and **Build Command** empty.
5. Deploy.

**Option B — Vercel CLI**

```bash
cd dos-curacao-platform
npx vercel
```

Follow the prompts for a preview deploy, then run `npx vercel --prod` for production.

`vercel.json` configures caching and security headers. `.vercelignore` excludes local deck/source files (PPTX, PDF, build script) from the deployment bundle.

---

## Replacing Placeholder Assets Later

Everything works right now with built-in CSS/SVG placeholders. Swap them as your AI assets arrive:

### 1. Hero background video → `assets/videos/hero-arrival.mp4`
- **Source:** Higgsfield — teacher arriving at Caribbean school, golden hour, 10–15s loop
- Already wired in `index.html` (`<video id="heroVideo">`). Just drop the file in. It auto-fades in.
- Add a poster frame at `assets/images/hero-poster.jpg` (a still from the video).

### 2. RFID reader render → `assets/renders/rfid-reader.png`
- **Source:** Ideogram or Flux — sleek wall NFC reader, white device, blue LED ring
- In `index.html` find `<!-- ASSET: replace with assets/renders/rfid-reader.png -->`
- Replace the `.rfid-reader` inner markup with: `<img src="assets/renders/rfid-reader.png" class="w-full h-full object-contain">`

### 3. Phone app screen → `assets/renders/app-checkin.png`
- **Source:** Flux — RFID check-in app screen, dark blue UI
- In `index.html` find `<!-- ASSET: replace .phone-screen content -->`
- Replace `.phone-screen` inner markup with the image, OR keep the animated CSS version (recommended — it's interactive).

### 4. Demo video (Watch the Demo button) → `assets/videos/rfid-tap.mp4`
- **Source:** Higgsfield — extreme close-up of the tap, 4–6s loop
- Wire the secondary CTA (`.cta-ghost`) to open this in a lightbox (add when ready).

### 5. DOS logo → `assets/logos/dos-logo.svg`
- In `index.html` find `.logo-mark` and replace the inline SVG with `<img src="assets/logos/dos-logo.svg" class="w-9 h-9">`

---

## What's Built (no asset needed)

These are coded, animated, and production-ready as-is:
- **Dashboard fragment** ("Live Attendance") — real CSS, counts up, row appears live on tap
- **RFID pulse rings** — pure CSS/SVG
- **Mesh gradient glows** — CSS, animated drift
- **Dot grid + film grain** — CSS/SVG
- **The signature product loop** — phone taps → pulse → dashboard updates (GSAP, repeats forever)
- **Entrance choreography** — badge → headline → sub → CTA → stats → product (GSAP timeline)
- **Scroll parallax** — layers move at different speeds

---

## Content (locked per brief)

- **Headline:** Modernizing Staff Attendance Across DOS Schools
- **Subheadline:** A secure, mobile-first attendance ecosystem built for the future of Curaçao's education infrastructure.
- **Benefits:** Mobile First · Secure & Verified · Real-Time Tracking
- **CTAs:** See How It Works · Watch the Demo

---

## Design Direction

**LIGHT / AWAKE theme** — premium government education platform.
Think Apple Education · Google for Education · Modern Digital Government.
NOT a startup, cybersecurity, or dark-SaaS aesthetic.
Clean, trustworthy, future-focused. Built for school teachers.

## Design Tokens

**Official DOS Brand (from DOS_Brand_Board.pptx) — solid colors, no gradients:**

| Token | Hex | Use |
|-------|-----|-----|
| DOS Blue | #0852A7 | PRIMARY — CTA, headline accent, structure (PANTONE 2945 C) |
| DOS Yellow | #F8CB0C | SECONDARY — RFID scan energy, accents (PANTONE 116 C) |
| DOS Red | #D72024 | ACCENT — alerts, absent status (PANTONE 485 C) |
| paper | #FFFFFF | Page background |
| mist | #F4F7FB | Soft surfaces |
| cloud | #EAF0F8 | Borders, dividers |
| ink | #0A1A2F | Primary text |
| slatey | #5A6B82 | Secondary text |
| present | #10B981 | On-time / live status |

**Fonts (official DOS):**
- **Archivo** — display / headlines / interface (Regular → Black)
- **Inter** — body copy
- **JetBrains Mono** — data, timestamps, labels
- *(Cinzel reserved for formal heraldic lockups — not used in product UI)*

**Logo:** Official ministry lockup at `assets/logos/dos-logo.png` (coat of arms + colour bar + signature, 3:1)

**Org:** Dienst Openbare Scholen · Curaçao
*Ministerie van Onderwijs, Wetenschap, Cultuur & Sport*

**Workflow order (left → right in product visual):**
DOS Check-In (phone) → DOS Reader (RFID) → Director Dashboard

---

## Notes
- Fully responsive (desktop → tablet → mobile)
- Honors `prefers-reduced-motion` (static fallback)
- Next step: PP-2 (do not build until approved)
