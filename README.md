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
| **🔰 First Timer Guide** | High-quality, verified commute tips and guidelines for newcomers navigating Manila. | Available ✅ |
| **🛡️ AI Safety Ratings** | Live maps displaying community-submitted danger, caution, and safe zones. | Available ✅ |
| **⏰ Last Trip Tracker** | Live, community-verified updates on jeepney and UV Express terminal times. | Available ✅ |
| **💰 Fare Board** | Complete matrix for school-to-school routes with statutory 20% student discounts. | Available ✅ |
| **🔀 Multi-Route Explorer** | Dynamic transit routing alternatives via Google Directions API. | Available ✅ |

---

## 🛠️ Technology Stack

* **Framework:** Next.js 15 (App Router) & React 19
* **Styling:** Tailwind CSS (Theme: Anti-Gravity Cyberpunk & Neo-Brutalism)
* **Database:** Supabase (PostgreSQL)
* **AI Engine:** Google Gemini API
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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser.

---

## 🏗️ Folder Structure & Architectural Blueprint

Understanding where everything goes makes contributing easy:

```
safe-route-ph/
├── .github/workflows/
│   └── build-check.yml             ← GitHub Action for lint & build validation
├── app/
│   ├── api/
│   │   ├── gemini/route.js         ← Gemini API endpoint
│   │   ├── reports/route.js        ← Reports submission endpoint
│   │   └── routes/route.js         ← Routes search API
│   ├── components/
│   │   ├── FeatureCards.jsx        ← Homepage features section
│   │   ├── Navbar.jsx              ← Brand navigation
│   │   └── SearchWidget.jsx        ← Main commute route finder
│   ├── fares/
│   │   └── page.jsx                ← Complete 2026 Fare matrix
│   ├── first-timer/
│   │   └── page.jsx                ← Guidance & tips page
│   ├── last-trip/
│   │   └── page.jsx                ← Last trip tracking page
│   ├── route-result/
│   │   └── page.jsx                ← Detailed Google Transit results
│   ├── safety/
│   │   └── page.jsx                ← Google Maps native zone plotting
│   ├── globals.css                 ← Tailwind styling rules
│   ├── layout.jsx                  ← Base metadata & layout
│   └── page.jsx                    ← Primary landing page
└── public/                         ← Static assets (icon.png)
```

---

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
