# SafeRoute PH 🛡️

A free, open-source, community-powered commute guide for Filipino students — built by students, for students.

🌐 **Live:** [saferoute-ph.vercel.app](https://saferoute-ph.vercel.app)

---

## About

SafeRoute PH gives Filipino college students the safety data, route knowledge, and reporting tools they need to commute safely. No login required — anyone can view, and anyone can contribute.

Built for the **Philippine Collegiate HackFest 2026** under the Sustainable Mobility & Transportation theme, aligned with **UN SDG 11: Sustainable Cities and Communities**.

---

## Features

| Feature | Description |
|---|---|
| 🗺️ Route Finder | Step-by-step jeepney and UV Express guides with multiple route options |
| 🛡️ AI Safety Ratings | Gemini classifies student reviews into Safe, Caution, or Unsafe |
| ⏰ Last Trip Tracker | Community-reported last departure times with student confirmations |
| 💰 Fare Board | Current fares with 20% student discount as mandated by law |
| 📖 First Timer Guide | Plain-language commute guide for students new to Manila |
| 🚨 Report a Concern | Gemini-screened safety reports published after AI review |
| 🗺️ Interactive Map | MapLibre GL map showing route paths, stop dots, and safety zones |
| 🔀 Multiple Routes | Compare routes by fare, time, safety score, and transfers |

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15 + React |
| Styling | Tailwind CSS |
| Map | MapLibre GL + react-map-gl + OpenFreeMap tiles |
| Database | Supabase — coming soon |
| AI | Google Gemini API — coming soon |
| Hosting | Vercel |

---

## Quick Start

```bash
git clone https://github.com/YOURUSERNAME/safe-route-ph.git
cd safe-route-ph
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) ✅

> ⚠️ Database and AI are coming soon. App runs on sample data for now.

---

## Environment Variables

> 🚧 Not required to run locally at this stage.

When database integration is added, create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=coming_soon
NEXT_PUBLIC_SUPABASE_ANON_KEY=coming_soon
DATABASE_URL=coming_soon
GEMINI_API_KEY=coming_soon
GOOGLE_MAPS_API_KEY=coming_soon
```

> Never commit `.env.local` to GitHub. It is already in `.gitignore`.

---

## Folder Structure

```
safe-route-ph/
├── app/
│   ├── api/
│   │   ├── gemini/route.js         ← Gemini AI endpoint
│   │   ├── reports/route.js        ← Reports API
│   │   └── routes/route.js         ← Routes search API
│   ├── components/
│   │   ├── Navbar.jsx              ← Global navbar
│   │   └── RouteMap.jsx            ← MapLibre interactive map
│   ├── fares/
│   │   └── page.jsx                ← Fare Board page
│   ├── first-timer/
│   │   └── page.jsx                ← First Timer Guide page
│   ├── last-trip/
│   │   └── page.jsx                ← Last Trip Tracker page
│   ├── route-result/
│   │   └── page.jsx                ← Route Result with map
│   ├── safety/
│   │   └── page.jsx                ← Safety Reports page
│   ├── globals.css                 ← Global styles
│   ├── layout.jsx                  ← Root layout
│   └── page.jsx                    ← Homepage with split search
└── public/                         ← Static assets
```

### Where things go

| What you are building | Where it goes |
|---|---|
| New page | `app/your-page/page.jsx` |
| Reusable component | `app/components/YourComponent.jsx` |
| API endpoint | `app/api/your-endpoint/route.js` |
| Map component | `app/components/RouteMap.jsx` |
| Global style | `app/globals.css` |
| Image or icon | `public/` |

---

## Contributor Guidelines

### Code Rules

- Add `'use client'` at the top of every page and component file
- Use **Tailwind CSS** for all styling — no inline styles, no external UI libraries
- Use **Next.js `Link`** for all internal navigation — never plain `<a>` tags
- Use **dynamic import with `ssr: false`** for the RouteMap component
- Keep components small and focused — one component does one thing
- Use descriptive variable names — `routeData` not `d`, `isMenuOpen` not `x`

### File Naming

| Type | Rule | Example |
|---|---|---|
| Pages | lowercase folder name | `app/route-result/page.jsx` |
| Components | PascalCase | `RouteCard.jsx`, `SafetyBadge.jsx` |
| API routes | always named `route.js` | `app/api/reports/route.js` |
| Utilities | camelCase | `formatDate.js`, `supabase.js` |

### UI Colors

Always use these exact hex values with Tailwind's arbitrary value syntax `bg-[#hex]`:

| Color | Hex | Used for |
|---|---|---|
| Navy | `#0B1F3A` | Navbar, hero sections, headings |
| Blue | `#1D4ED8` | Buttons, links, accents |
| Light blue | `#EAF2FA` | Card backgrounds |
| Page bg | `#F5F7FB` | Page background |
| Text gray | `#555555` | Subtitles, descriptions |
| Red | `#DC2626` | Unsafe at Night badge |
| Orange | `#EA580C` | Overcharging badge |
| Purple | `#7C3AED` | Harassment badge |
| Green | `#16A34A` | Safe badge, success |
| Amber | `#EA580C` | Last Trip Soon badge |

---

## Commit Message Rules

Every commit must follow this format:

```
type(scope): short description
```

### Types

| Type | When to use |
|---|---|
| `feat` | Adding a new feature |
| `fix` | Fixing a bug |
| `style` | Tailwind or CSS changes only — no logic change |
| `refactor` | Rewriting code without changing behavior |
| `docs` | README or documentation changes only |
| `chore` | Config, dependencies, setup files |
| `perf` | Performance improvements |

### Scopes

```
navbar  home  route-finder  route-result  map
safety  fares  first-timer  last-trip
reports  gemini  supabase  readme  deps
```

### Good ✅

```bash
feat(route-finder): add search bar with split screen transition
feat(map): add maplibre interactive map with route polylines
feat(last-trip): add last trip tracker page with report form
fix(navbar): fix mobile menu not closing on link click
style(home): update hero section background and font size
docs(readme): update folder structure with new pages
chore(deps): install maplibre-gl and react-map-gl
feat(gemini): add safety report classification prompt
fix(reports): fix approved reports not showing on route page
feat(route-result): add multiple route comparison cards
```

### Bad ❌

```bash
fix
changes
update
final
FINAL v2
idk
done
testing
asdfgh
```

### Rules

- Lowercase only
- Under 72 characters
- Present tense — `add` not `added`
- No period at the end
- Reference issues when relevant — `fix(reports): fix badge color (#12)`

---

## Branch Naming Rules

Never commit directly to `main`. Always create a new branch.

```
type/short-description
```

### Good ✅

```bash
feature/route-finder
feature/safety-ratings
feature/last-trip-tracker
feature/fare-board
feature/interactive-map
feature/multiple-routes
fix/navbar-mobile-menu
fix/maplibre-ssr-error
style/homepage-hero
docs/update-readme
chore/install-maplibre
```

### Bad ❌

```bash
main
mybranch
test
final
new
fix2
gabriels-changes
```

### Rules

- Kebab-case — hyphens only, no spaces, no underscores
- Short and descriptive
- Always branch off `main`
- Delete your branch after PR is merged

---

## Pull Request Rules

- One feature or fix per PR — do not bundle unrelated changes
- `npm run dev` must run with zero errors before opening a PR
- Write a clear description — what changed and why
- Do not touch files unrelated to your change
- Never commit `node_modules`, `.env.local`, or build output
- Map components must use `dynamic import` with `ssr: false`

---

## Roadmap

- [x] Project setup with Next.js and Tailwind
- [x] Homepage with split screen search
- [x] Navbar with all page links
- [x] First Timer Guide page
- [x] Safety Reports page with report form
- [x] Last Trip Tracker page
- [x] Fare Board page
- [x] Route Result page with step by step guide
- [x] Interactive MapLibre map with route polylines
- [x] Multiple route comparison cards
- [ ] Supabase database integration
- [ ] Gemini AI safety report classification
- [ ] Gemini AI route suggestion fallback
- [ ] Real route data from student submissions
- [ ] PWA mobile support
- [ ] Expand to UST, FEU, PUP, Ateneo routes

---

## License

MIT — free to use, modify, and distribute with credit. See [LICENSE](LICENSE).

---

*SafeRoute PH — Because every student deserves to get home safely.* 🛡️