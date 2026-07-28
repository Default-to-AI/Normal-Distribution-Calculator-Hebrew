# Statisti-Kal — Project Knowledge

Hebrew-first (RTL) academic statistics calculator web app for students. Provides hypothesis testing, normal distribution, point estimation, linear regression, and formula/tables reference — all with step-by-step guided workflows and interactive charts.

## Quickstart

All code lives in `web/`. Run from that directory:

```bash
cd web
npm install        # (pnpm also supported)
npm run dev        # Vite dev server on port 3000 (open network: 0.0.0.0)
npm run build      # Production build
npm run preview    # Preview production build
npm test           # Vitest (jsdom)
npm run lint       # tsc --noEmit + color lint
npm run lint:tsc   # TypeScript type-check only
npm run lint:colors # Color token validation
```

## Architecture

- **Entry:** `web/src/main.tsx` → `web/src/App.tsx`
- **Pages:** `App.tsx` lazy-loads calculators via React.Suspense. Active page state (`landing`, `hypothesis`, `point-estimation`, `normal`, `summary`, `regression`) drives routing in-app (no React Router).
- **Calculators:** `HypothesisTestingCalculator`, `NormalDistributionCalculator`, `PointEstimationPage`, `LinearRegressionCalculator` — each is a top-level page component.
- **UI primitives:** `web/src/components/ui/` — shared design-system components (Button, Card, Input, Modal, Heading, Accordion, Tooltip, etc.). **All new UI must use these templates** (per DESIGN.md), never raw `<div>` for foundational elements.
- **Statistics logic:** `web/src/lib/statistics/` — pure functions for hypothesis testing, math helpers, and power calculations.
- **Charts:** `web/src/components/charts/` — D3.js + Recharts-based charts (NormalChart, HypothesisChart, ChartPrimitives).
- **Calc UI widgets:** `web/src/components/calc-ui/` — parameter inputs, mode switches, formula tokens specific to calculator pages.
- **Guided tours:** `web/src/config/tours.ts` + react-joyride for step-by-step Hebrew walkthroughs.
- **Data flow:** No global state library. Calculator state is local React state passed via props. `useLocalStorageState` hook for persistence. Tour state managed in `App.tsx`.

## Design & Styling

- **Aesthetic direction:** Editorial Academic (v2.0, per `DESIGN.md`). Warm paper background, Indigo primary accent, sophisticated narrative-first typography. Goal is "high-end printed textbook", not "cockpit/dashboard".
- **Theme tokens:** Tailwind CSS v4 (`@tailwindcss/vite`). Tokens are defined in `web/src/index.css` via CSS custom properties and the `@theme` block. The `@theme` block exposes tokens as Tailwind utilities (e.g., `bg-primary`); `:root` tokens are consumed via `var()` directly. Don't conflate the two.
- **Background (paper):** `--color-background` (`#F9F9F6`) — warm off-white, reduces eye strain.
- **Surface (cards):** `--color-surface` (`#FFFFFF`) — pure white for calculation blocks and interactive panels.
- **Primary text (ink):** `--color-text-primary` (`#1A1A1A`) — deep ink.
- **Accent (Indigo):** `--color-accent-primary` (`#4361EE`) — academic indigo for active states, primary buttons, H₁ references.
- **Semantic / Charting:**
  - Success / acceptance: `#10B981` (teal/green)
  - Error / rejection: `#EF4444` (crimson)
  - Warning / H₀: `#D4A843` (retained brass — semantic role only, not the dominant accent)
- **Fonts:**
  - Display/Hero (Hebrew): `Assistant` (Weights 600-800)
  - Serif accents (Hebrew, sparing): `Frank Ruhl Libre`
  - Body (Hebrew): `Assistant` (Weights 400-500)
  - Math/formulas: **KaTeX** (always — see KaTeX formatting rule below)
  - Data/tabular (only): `Geist Mono` (tabular-nums, not for equations)
  - Handwriting: `Gveret Levin` — used by the `HandwrittenNote` component for human annotations.
- **Motion:** `motion` (Framer Motion) for page transitions and staggered entrances. Intentional, choreographed; no bouncy/overly-playful animations.
- **Spacing:** 8px base unit; spacious density; generous whitespace. Border radius: minimal — `--radius-sm` (4px), `--radius-md` (8px).
- **Math rendering:** KaTeX via `react-katex`. Formula display uses the `FormulaBlock` component.
- **RTL:** Full Hebrew right-to-left interface. KaTeX blocks are force-isolated to LTR (critical — do not modify the `.katex` rules in `index.css`). Use `String.raw` for all KaTeX strings and explicit LaTeX macros (`\sigma`, `\bar{x}`), never raw Unicode characters or non-raw JS strings.

## Conventions

- **TypeScript strict(ish):** `strict: false` in tsconfig but `noEmit: true`, ESNext modules, ES2022 target.
- **Imports:** Path alias `@/*` maps to `web/*` root. Use it for absolute imports within `web/`.
- **File naming:** PascalCase for components, camelCase for hooks/utils/tests. Test files use `.test.ts(x)` suffix.
- **Testing:** Vitest + jsdom + Testing Library. Setup file: `web/src/test-setup.ts`. Test files colocated with source.
- **Package manager:** `npm` is primary (scripts reference npm). `pnpm` lockfile also present — use `pnpm` if preferred.
- **Components must use design tokens:** Colors via `var(--color-*)`, spacing via Tailwind utilities, rounded corners via `var(--rounded-*)`.

## Gotchas

- **KaTeX RTL isolation is sacred.** The `!important` LTR rules in `index.css` are essential for correct math rendering in an RTL page. Never remove or weaken these.
- **KaTeX strings MUST use `String.raw`.** JS string literals silently consume `\b`/`\m`/`\s` before KaTeX sees them (`\bar{x}` → `ar{x}`, `\mu` → `mu`, `\sigma` → `igma`). Use `` String.raw`\mu` `` and explicit LaTeX macros — never raw Unicode characters (`σ`, `μ`, `x̄`) inside `math={...}` props.
- **HMR disabled in AI Studio:** `vite.config.ts` checks `DISABLE_HMR` env var — file watching is turned off during agent edits to prevent flickering.
- **`npm run lint:colors`** validates color token usage against the DESIGN.md palette (no raw slate/gray/zinc, no magic numbers). Run it after adding new colored UI.
- **The `@theme` block and `:root` tokens in `index.css` serve different purposes.** `@theme` exposes tokens as Tailwind utilities (e.g., `bg-primary`); `:root` tokens are consumed via `var()` directly. Don't conflate the two.
- **No React Router.** Navigation is managed through `activePage` state in `App.tsx` and callbacks passed down. Add new pages by extending the `ActivePage` type and `SitePage` type.
- **Calculators MUST use the Global Templating Architecture** defined in `DESIGN.md` / `STRATEGY.md` / `CONTEXT.md`. Domain calculators handle only math + state; all rendering is delegated to `web/src/components/ui/` primitives (Heading/SectionHeader for titles, ChartWrapper for Recharts, ResultBlock/FormulaBlock/HandwrittenNote for results). Raw `<h1>`-`<h3>` in calculators is a DESIGN.md §3 violation.
- **No glow/pulse/cockpit aesthetics.** The "stagger-in/curve-glow/pulse-brass" framing belongs to the previous (rejected) dark-brass system. Current system is Editorial Academic — restrained, paper-like, narrative-first.
- **Page titles via `Heading`/`SectionHeader`** (with optional brass→teal accent bar), not raw `<h1>`/`<h2>`.
