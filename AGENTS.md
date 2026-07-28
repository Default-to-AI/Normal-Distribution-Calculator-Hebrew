# AGENTS.md — Statisti-Kal

## Project Entry Point

This file routes AI agents to the canonical context and strategy documents for the Statistics Calculator project.

---

## Primary Documents

| Document | Purpose | Required Reading |
|----------|---------|------------------|
| **STRATEGY.md** | Product anchor — target problem, approach, persona, key metrics, tracks, constraints, non-goals | **YES** — All agents must read first |
| **CONTEXT.md** | Current architecture, known issues, component inventory, tech stack, open technical decisions | **YES** — All agents must read second |

---

## Quick Context (for immediate orientation)

**Product**: Hebrew RTL-first academic statistics instrument for students. Editorial Academic aesthetic: warm paper background, Indigo primary accent, Assistant typography, KaTeX for all math.

**Stack**: React 19 + TypeScript + Vite + Tailwind v4 + D3/Recharts + Motion + KaTeX

**Critical State**:
- `DESIGN.md` = comprehensive spec (Three-Layer Method compliant, v2.0 Editorial Academic)
- `web/tokens.json` / `web/tailwind.theme.json` / `web/src/index.css` = faithful token implementation
- **Calculators** (eight total — each is a top-level page component):
  - `web/src/components/HypothesisTestingCalculator.tsx` — ~308KB (refactor target: <50KB)
  - `web/src/components/NormalDistributionCalculator.tsx` — ~56KB (refactor in progress; support modules extracted under `web/src/components/calc-ui/`, `charts/`, `tables/`, `results/`)
  - `web/src/components/LinearRegressionCalculator.tsx`
  - `web/src/components/PointEstimationPage.tsx`
  - `web/src/components/TestYourselfPage.tsx`
  - `web/src/components/Exam2023Page.tsx`
  - `web/src/components/FormulaSheet.tsx`
  - `web/src/components/StatisticalHelperModal.tsx`
- **Primitive component library** under `web/src/components/ui/` (~27 files):
  Button, Card, Input, Modal, Heading, Accordion, Tooltip, PageLayout,
  PageHeader, FormulaBlock, ResultBlock, HandwrittenNote, Table,
  TableOfContents, Badge, InteractiveNormalGraph, MCQuestionCard,
  CustomComponents, CyberneticBackground, navbar-menu, NewsletterForm,
  PageTransition, ScrollToTopButton, SiteFooter, SiteHeader, plus tests and `index.ts`.

**Current Phase**: Implementation (post-analysis). P0 remediation → primitive components → calculator rebuild → feature work.

---

## Routing Rules for Agents

| Agent Role | Entry Point | Then Read |
|------------|-------------|-----------|
| **strategist** | STRATEGY.md | CONTEXT.md, DESIGN.md |
| **engineer** | STRATEGY.md | CONTEXT.md, DESIGN.md, web/tokens.json, web/src/index.css |
| **reviewer** | STRATEGY.md | CONTEXT.md, DESIGN.md |
| **vault** | STRATEGY.md | Vault context: Hebrew RTL, Indigo accent, Assistant/Space Grotesk/JetBrains Mono, academic statistics domain |

---

## Skill Discovery Rule (No Guessing)

Agents do not automatically possess knowledge of local workspace skills. Therefore, before beginning any new task (e.g., planning, debugging, refactoring, design):
1. **Search**: You MUST actively inspect the `.agents/skills/` directory (using directory listing or search tools) to see if a relevant skill exists.
2. **Read**: If a matching skill folder exists, use the `view_file` tool to read its `SKILL.md` file.
3. **Comply**: Follow the skill's instructions exactly. Do NOT guess workflows, invent processes, or rely on generic knowledge when a specific skill is available.

---

## Key Files Map

```
C:/Users/Tiger/Agents/Projects/statisti-kal/
├── STRATEGY.md                    ← READ FIRST (product anchor)
├── CONTEXT.md                     ← READ SECOND (architecture + issues)
├── DESIGN.md                      ← Design system spec (authoritative, v2.0 Editorial Academic)
├── IDEA.md                        ← Original product vision (superseded by DESIGN.md v2.0)
├── knowledge.md                   ← Agent-facing project knowledge (architecture, conventions, gotchas)
├── web/
│   ├── tokens.json                    ← W3C DTCG token export
│   ├── tailwind.theme.json            ← Tailwind v3 theme export
│   ├── src/index.css                  ← @theme + CSS custom properties (source of truth)
│   ├── src/App.tsx                    ← Routing hub (in-app `activePage` state, no React Router)
│   ├── src/main.tsx                   ← React entry
│   ├── src/lib/statistics/            ← Pure functions: hypothesis testing, math helpers, power calc
│   ├── src/components/
│   │   ├── HypothesisTestingCalculator.tsx   (~308KB — refactor target: <50KB)
│   │   ├── NormalDistributionCalculator.tsx  (~56KB — refactor in progress)
│   │   ├── LinearRegressionCalculator.tsx
│   │   ├── PointEstimationPage.tsx
│   │   ├── TestYourselfPage.tsx
│   │   ├── Exam2023Page.tsx
│   │   ├── FormulaSheet.tsx
│   │   ├── StatisticalHelperModal.tsx
│   │   ├── LandingPage.tsx
│   │   ├── SiteHeader.tsx / SiteFooter.tsx
│   │   ├── calc-ui/                          (parameter inputs, mode switches, formula tokens)
│   │   ├── charts/                           (NormalChart, HypothesisChart, ChartPrimitives)
│   │   ├── tables/                           (ZTable + t critical values)
│   │   ├── results/                          (FormattedStep, conclusion blocks)
│   │   ├── tours/                            (react-joyride step definitions)
│   │   └── ui/                               (~27 primitive components — Button, Card, Input, Modal, Heading, Accordion, Tooltip, PageLayout, PageHeader, FormulaBlock, ResultBlock, HandwrittenNote, Table, TableOfContents, Badge, InteractiveNormalGraph, MCQuestionCard, CustomComponents, CyberneticBackground, navbar-menu, NewsletterForm, PageTransition, ScrollToTopButton, SiteFooter, SiteHeader, plus tests and `index.ts`)
│   ├── src/hooks/useLocalStorageState.ts
│   ├── src/test-setup.ts
│   └── scripts/                               (build-og-image.mjs, lint-colors.mjs)
```

---

## Workflow Protocol (Context Engineering)

This project follows the **Compound Engineering (CE) workflow**:

1. **ce-strategy** (Read `.agents/skills/ce-strategy/SKILL.md`) → STRATEGY.md (DONE)
2. **ce-brainstorm** (Read `.agents/skills/ce-brainstorm/SKILL.md`) → brainstorm notes (kept in skill folder)
3. **ce-plan** (Read `.agents/skills/ce-plan/SKILL.md`) → confidence-gated implementation plan with verification gates
4. **ce-work** (Read `.agents/skills/ce-work/SKILL.md`) → execute in worktrees with CI gates
5. **ce-code-review** (Read `.agents/skills/ce-code-review/SKILL.md`) → 12-persona review on major refactor
6. **ce-compound** (Read `.agents/skills/ce-compound/SKILL.md`) → extract lessons into reusable skills/patterns

**Do not skip steps**. STRATEGY.md blocks all downstream work until complete.

---

## Verification Gates (Non-Negotiable)

| Gate | Requirement | Tool |
|------|-------------|------|
| **TypeScript** | `npm run lint:tsc` passes (noEmit) | tsc |
| **Color Tokens** | `npm run lint:colors` passes (no raw slate/gray/zinc, no magic numbers) | custom script |
| **Build** | `npm run build` succeeds | Vite |
| **Design Token Compliance** | All components consume semantic tokens from DESIGN.md | manual review + lint-colors |
| **RTL Visual** | Hebrew RTL renders correctly in dark + light | manual + future visual regression |
| **Bundle Size** | HypothesisTestingCalculator < 50KB (post-refactor) | rollup-plugin-visualizer |

## Workspace Cleanliness & Scratchpad Rules

**CRITICAL RULE FOR ALL AGENTS**: Do NOT pollute the project root or `web/src/` directories with temporary files, scripts, or patches.
- **Throwaway Files**: If you need to create throwaway scripts, tests, patches (`.patch`), debug logs, or intermediate code files, you **MUST** save them inside the `.scratch/` directory. (The `.scratch/` directory is automatically ignored by Git).
- **Migration & Refactoring Leftovers**: When moving, renaming, or refactoring files and folders, **ALWAYS delete the old versions/originals** immediately after verifying the move. Never leave behind dead folders (e.g., leaving an old `Agent-Skills` folder after moving its contents).
- **Test Artifacts**: Any generated files during testing (like screenshots, logs, or temporary DBs) that aren't needed must be proactively deleted.
- **Boy Scout Rule**: Always leave the workspace cleaner than you found it. Clean up any stray files you mistakenly create in the root before completing your task.

---

## Contact / Escalation

- **Product Owner**: Robert (Hebrew RTL, statistics domain, design decisions)
- **Hermes Profiles**: default (hub), strategist, engineer, reviewer, vault
- **Vault Domain**: `Agent Skills` / `AI Sphere` / `Hermes` for agent workflow context

---

## KaTeX Formatting Rule (Crucial)

**ALWAYS use `String.raw` for KaTeX strings.**
When writing or modifying mathematical expressions in TypeScript/JSX (e.g., inside `<InlineMath>`, `<BlockMath>`, or data objects), you MUST use `` String.raw`...` `` template literals instead of standard string literals.

**Why:** JavaScript string literals silently consume escape sequences before KaTeX sees them. For example:
- `\b` acts as a backspace: `math="\bar{x}"` is evaluated as `ar{x}`.
- `\m` is ignored: `math="\mu"` is evaluated as `mu` (fails to render the Greek letter).
- `\s` is ignored: `math="\sigma"` is evaluated as `igma`.
Using `String.raw` prevents this and preserves the backslashes exactly as written.

**Unicode vs. LaTeX Macros:**
NEVER inject raw Unicode math characters (e.g., `σ`, `μ`, `x̄`) directly inside `math={...}` props. Always use the explicit LaTeX macros (`\sigma`, `\mu`, `\bar{x}`) to ensure safe, consistent rendering by KaTeX.

**Examples:**
- ❌ **Bad:** `<InlineMath math="\\text{Hello}" />`
- ❌ **Bad:** `<InlineMath math="\bar{x}=42" />` (renders as `ar{x}=42`)
- ❌ **Bad:** `<InlineMath math={String.raw`σ`} />` (raw unicode)
- ✅ **Good:** `<InlineMath math={String.raw`\text{Hello}`} />`
- ✅ **Good:** `<InlineMath math={String.raw`\bar{x}=42`} />`
- ✅ **Good:** `<InlineMath math={String.raw`\sigma`} />`

---

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
The aesthetic is "Editorial Academic" — a warm, clean, narrative-first approach to math using Indigo as the primary accent, with KaTeX for all formulas.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.
