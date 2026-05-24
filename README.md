# UniWolfe Route

[![Build and Test](https://github.com/gabrielhipolito-dev/safe-route-ph/actions/workflows/build-check.yml/badge.svg)](https://github.com/gabrielhipolito-dev/safe-route-ph/actions/workflows/build-check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Open Source Love](https://img.shields.io/badge/Open%20Source-❤-emerald.svg)](https://github.com/gabrielhipolito-dev/safe-route-ph)

A free, community-powered commute intelligence platform for Filipino students — built by students, for students.

🌐 **Live Website:** [uniwolfe-route.vercel.app](https://uniwolfe-route.vercel.app)

---

## 📖 About UniWolfe Route

UniWolfe Route is designed to help Filipino college students access crucial safety data, transit routes, and reporting tools to ensure they can commute safely across Metro Manila. From real-time transit options to community-reported danger zones and verified legal student fares, UniWolfe Route removes the guesswork from public transit.

Aligned with **UN Sustainable Development Goal 11: Sustainable Cities and Communities**, this project was created for the **Philippine Collegiate HackFest 2026** under the theme of Sustainable Mobility.

---

## ⚡ Core Features

| Feature | Description | Status |
|---|---|---|
| **🔰 First Timer Guide** | Verified commute tips and guidelines for newcomers navigating Manila. | Available ✅ |
| **🛡️ Safety Zones Map** | Google Maps-powered pins for safe, caution, and danger zones. | Available ✅ |
| **⏰ Last Trip Tracker** | Live-style community updates on terminal cutoff times. | Available ✅ |
| **💰 Custom Fare Board** | Student-uploaded fare breakdowns stored locally per browser. | Available ✅ |
| **🔀 Multi-Route Explorer** | Google Directions-based route alternatives with fare estimates. | Available ✅ |

---

## 🛠️ Technology Stack

* **Framework:** Next.js 16 (App Router) & React 19
* **Styling:** Tailwind CSS (Theme: Anti-Gravity Cyberpunk & Neo-Brutalism)
* **Database:** Supabase (PostgreSQL, planned)
* **AI Engine:** Google Gemini API (planned)
* **Hosting:** Vercel

---

## 🚀 Getting Started

Follow these steps to run UniWolfe Route locally:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 20 or higher)
- npm (version 10 or higher)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/gabrielhipolito-dev/safe-route-ph.git

# Navigate into project folder
cd safe-route-ph

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key # optional client-side fallback for embeds
```

> Supabase and Gemini keys are reserved for future API routes. Current features run without them.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser.

---

## 📦 Scripts

```bash
npm run lint   # ESLint
npm run build  # Next.js production build
npm run start  # Start production server
npm run ci     # Lint + build + npm audit (audit level: high)
npm run audit  # Security audit only
```

---

## 🏗️ Folder Structure & Architectural Blueprint

Understanding where everything goes makes contributing easy:

```
safe-route-ph/
├── .github/workflows/
│   └── build-check.yml             ← GitHub Action for lint & build validation
├── app/
│   ├── api/
│   │   ├── gemini/route.js         ← Placeholder for Gemini API
│   │   ├── reports/route.js        ← Placeholder for report submission
│   │   └── routes/route.js         ← Live route search API
│   ├── components/
│   │   ├── FeatureCards.jsx        ← Homepage features section
│   │   ├── Navbar.jsx              ← Brand navigation
│   │   └── SearchWidget.jsx        ← Main commute route finder
│   ├── custom-route/
│   │   └── page.jsx                ← Custom fare board (localStorage)
│   ├── fares/
│   │   └── page.jsx                ← Complete 2026 Fare matrix
│   ├── first-timer/
│   │   └── page.jsx                ← Guidance & tips page
│   ├── last-trip/
│   │   └── page.jsx                ← Last trip tracking page
│   ├── route-result/
│   │   ├── RouteSelector.jsx       ← Route options + embedded map
│   │   └── page.jsx                ← Detailed Google Transit results
│   ├── safety/
│   │   ├── SafetyClient.jsx        ← Google Maps client
│   │   └── page.jsx                ← Safety zone UI
│   ├── data/
│   │   └── *.js                    ← Static seed data for UI
│   ├── lib/
│   │   ├── fareScraper.js          ← Fare scraping utilities
│   │   └── routeSearch.js          ← Google Directions integration
│   ├── globals.css                 ← Tailwind styling rules
│   ├── layout.jsx                  ← Base metadata & layout
│   └── page.jsx                    ← Primary landing page
├── data/
│   └── scraped_fares.json          ← Optional scraped fare cache
├── tools/
│   ├── fareSources.json            ← Scrape targets
│   └── scrapeFares.js              ← Node scraper entrypoint
└── public/                         ← Static assets (icon.png)
```

---

## 🧾 Data & Storage

- Most UI data lives in `app/data/*` and is shipped as static seed content.
- Custom fare board entries are stored in the browser’s `localStorage`.
- Optional scraped fares are cached in `data/scraped_fares.json`.

---

## 🧪 Optional Fare Scraping

```bash
node tools/scrapeFares.js
```

Updates `data/scraped_fares.json` using sources defined in `tools/fareSources.json`.

## 🎨 Aesthetic & Design Rules

To maintain high visual standards, all UI code MUST follow our **Anti-Gravity Cyberpunk & Neo-Brutalism** aesthetic:
1. **Backgrounds:** Pure/Space Black (`bg-slate-950`).
2. **Accents:** High-vibrancy Neon Emerald Green (`text-emerald-400`, `bg-emerald-500/10`) with ambient glowing drop shadows.
3. **Typography:** Chunky, heavy sans-serif headings (`font-black tracking-tight uppercase`).
4. **Interactive Bento Layouts:** Glassmorphic card design (`bg-white/5 border border-white/10 backdrop-blur-md hover:-translate-y-2 transition duration-300`).

---

## 🤝 Contribution Best Practices

We welcome developers of all skill levels! Please follow these guidelines:

1. **Keep it Focused:** One feature or bug fix per Pull Request.
2. **Code Style:** Always use Tailwind CSS for all styling. Never use raw inline styles or ad-hoc classes.
3. **Pull Request Validation:** Ensure `npm run build` succeeds locally with zero errors before opening a pull request.
4. **Branching Model:** 
   - Never commit to `main`. Create a descriptive feature branch: `feature/your-feature-name` or `fix/issue-description`.
   - Submit a pull request targeting `main`.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

---

*UniWolfe Route — Because every student deserves to get home safely.* 🛡️
