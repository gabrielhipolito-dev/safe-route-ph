# SafeRoute PH 🛡️

A free, open-source, community-powered commute guide for Filipino students — built by students, for students.

🌐 **Live:** [saferoute-ph.vercel.app](https://saferoute-ph.vercel.app)

---

## About

SafeRoute PH gives Filipino college students the safety data, route knowledge, and reporting tools they need to commute safely. No login required — anyone can view, and anyone can contribute.

Built for the **Philippine Collegiate HackFest 2026** under the Sustainable Mobility & Transportation theme, aligned with **UN SDG 11: Sustainable Cities and Communities**.

---

## Features

- 🗺️ **Route Finder** — step-by-step jeepney and UV Express guides
- 🛡️ **AI Safety Ratings** — Gemini classifies reviews into Safe, Caution, Unsafe
- ⏰ **Last Trip Tracker** — community-reported last departure times
- 💰 **Fare Board** — current fares with 20% student discount
- 📖 **First Timer Guide** — plain-language commute guide for new students
- 🚨 **Report a Concern** — Gemini-screened safety reports

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15 + React |
| Styling | Tailwind CSS |
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
```

> Never commit `.env.local` to GitHub. It is in `.gitignore`.

---

## Folder Structure

```
safe-route-ph/
├── app/
│   ├── api/
│   │   ├── gemini/route.js       ← Gemini AI endpoint
│   │   ├── reports/route.js      ← Reports API
│   │   └── routes/route.js       ← Routes search API
│   ├── components/
│   │   └── Navbar.jsx            ← Global navbar
│   ├── fares/
│   │   └── page.jsx              ← Fare Board page
│   ├── first-timer/
│   │   └── page.jsx              ← First Timer Guide page
│   ├── route-result/
│   │   └── page.jsx              ← Route Result page
│   ├── safety/
│   │   └── page.jsx              ← Safety Reports page
│   ├── globals.css               ← Global styles
│   ├── layout.jsx                ← Root layout
│   └── page.jsx                  ← Homepage
└── public/                       ← Static assets
```

### Where things go

| What you are building | Where it goes |
|---|---|
| New page | `app/your-page/page.jsx` |
| Reusable component | `app/components/YourComponent.jsx` |
| API endpoint | `app/api/your-endpoint/route.js` |
| Global style | `app/globals.css` |
| Image or icon | `public/` |

---

## Contributor Guidelines

### Code Rules

- Add `'use client'` at the top of every page and component file
- Use **Tailwind CSS** for all styling — no inline styles, no external UI libraries
- Use **Next.js `Link`** for all internal navigation — never plain `<a>` tags
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
navbar  home  route-finder  route-result
safety  fares  first-timer  reports  gemini
supabase  readme  deps
```

### Good ✅

```bash
feat(route-finder): add search bar with school and destination inputs
fix(navbar): fix mobile menu not closing on link click
style(home): update hero section background and font size
docs(readme): add color palette to contributor guidelines
chore(deps): install supabase-js and generative-ai
feat(gemini): add safety report classification prompt
fix(reports): fix approved reports not showing on route page
feat(fare-board): add recently changed flag for updated fares
refactor(navbar): simplify mobile menu toggle logic
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
fix/navbar-mobile-menu
fix/gemini-response-parsing
style/homepage-hero
docs/update-readme
chore/tailwind-config
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

---

## Roadmap

- [x] Project setup with Next.js and Tailwind
- [x] Homepage with route search bar
- [x] First Timer Guide page
- [ ] Route Result page
- [ ] Safety Reports page
- [ ] Fare Board page
- [ ] Supabase database integration
- [ ] Gemini AI safety ratings
- [ ] Last Trip Tracker
- [ ] Report a Concern with Gemini screening
- [ ] PWA mobile support
- [ ] Expand to UST, FEU, PUP routes

---

## License

MIT — free to use, modify, and distribute with credit. See [LICENSE](LICENSE).

---

*SafeRoute PH — Because every student deserves to get home safely.* 🛡️