# KoinX – Tax Loss Harvesting Tool

A responsive, dark-themed React interface that helps crypto investors visualise and optimise their capital gains tax by selecting holdings to "harvest." Built as a frontend assignment using mock APIs — no real backend required.

---

## Live Demo

> Deploy to Vercel: connect the repo and Vercel auto-detects Vite. The `vercel.json` SPA rewrite is already included.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server → http://localhost:5173
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## Features

- **Pre-Harvesting card** — displays your current Short-term and Long-term capital gains straight from the mock API (unaffected by any selection).
- **After Harvesting card** — mirrors the Pre numbers on load, then **recalculates live** every time you check or uncheck a holding.
- **Savings banner** — a `🎉 You are going to save upto ₹X` line appears inside the After Harvesting card only when the post-harvest realised gain is lower than the pre-harvest figure. It disappears automatically when no savings apply.
- **Holdings table** — lists all 25 crypto assets with coin icon, name, holdings, current market rate, total current value, short-term gain, long-term gain, and amount to sell.
- **Select / deselect** — per-row checkboxes plus a header "select all" checkbox. Selecting a row instantly updates the After Harvesting card.
- **View all / View less** — table initially shows 5 rows; clicking "View all" expands to all 25 rows.
- **Important Notes & Disclaimers** — collapsible accordion at the top of the page with regulatory disclaimers.
- **Loading skeletons** — both the cards and the table show animated skeleton placeholders during the 400 ms mock API delay.
- **Error states** — friendly error messages if either API call fails.
- **Fully responsive** — cards stack vertically on mobile; the holdings table scrolls horizontally instead of breaking layout.

---

## Project Structure

```
src/
├── apis/                        # Mock API layer (Promise + setTimeout)
│   ├── holdings/index.js
│   └── capitalGains/index.js
├── mocks/                       # Static JSON fixtures
│   ├── holdings.json
│   └── capitalGains.json
├── hooks/
│   ├── apis/                    # React Query wrappers
│   │   ├── holdings/useGetHoldings.js
│   │   └── capitalGains/useGetCapitalGains.js
│   └── context/
│       └── useHarvesting.js     # Context consumer hook
├── context/
│   └── HarvestingContext.jsx    # Selection state (selectedIds, toggleHolding, toggleAll)
├── utils/
│   ├── capitalGains.js          # Pure math functions (no React deps)
│   └── format.js                # formatCurrency, formatTokenAmount
├── components/
│   ├── atoms/                   # CoinIcon, GainValue, StatRow
│   ├── molecules/               # CapitalGainsCard, ImportantNotes, HoldingsTableRow/Header, SavingsBanner
│   └── organisms/               # CapitalGainsSection, HoldingsTable
├── pages/
│   └── TaxHarvesting/           # Route-level page, composes all organisms
├── lib/utils.js                 # cn() Tailwind class merge helper
└── Routes.jsx                   # Central route definition
```

---

## Architecture Decisions

### Mock API layer
Both APIs (`getHoldings`, `getCapitalGains`) return a `Promise` that resolves after a 400 ms `setTimeout`. This simulates network latency so loading skeletons are always visible on first load — same boundary as a real app with a backend.

### React Query
All server state lives in React Query's cache. Components never copy API data into `useState`. This means the cache is the single source of truth for holdings and capital gains data.

### Context for selection state
`HarvestingContext` holds only the `selectedIds` Set. It derives `selectedHoldings` (the actual holding objects) by filtering the React Query cache — no duplication. The context is consumed exclusively through `useHarvesting()`, never `useContext` directly in a component.

### Pure business logic
All capital gains math lives in `src/utils/capitalGains.js` as plain functions with no React or DOM dependency:

| Function | What it does |
|---|---|
| `getNetGain({ profits, losses })` | `profits - losses` |
| `getRealisedGain(capitalGains)` | Sum of STCG net + LTCG net |
| `applyHarvestSelection(base, holdings)` | Returns a **new** capital gains object with selected holdings folded in. Never mutates the original. |
| `getSavings(pre, post)` | Returns `pre - post` only when `pre > post`, otherwise `null` |

### Numeric formatting
Some holdings carry extreme values like `3.47e-17` or `8.66e-7`. Raw scientific notation is never rendered. Instead:
- **Currency (₹):** `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })`
- **Token amounts:** Values below `0.000001` render as `< 0.000001`. Values ≥ 1000 use `en-IN` with up to 4 decimal places. Others use `toPrecision(8)` to strip trailing zeroes.
- Both helpers live in `src/utils/format.js` and are imported wherever needed — never inlined per component.

### Table sort order
Holdings are displayed in **fixture order** (as returned by the API). The mock dataset is already roughly sorted by recognisability (major coins first), which is the most useful default for a harvesting interface where users scan for familiar assets. A future improvement would be a clickable column header sort.

### Two USDC rows
The dataset contains two entries with `coin: "USDC"` but different `coinName` and logo (native USDC vs Bridged USDC). Each row is keyed by array index, never by coin symbol, so they remain independently selectable.

### Atomic Design
Components follow atoms → molecules → organisms → pages. Organisms own data-fetching and layout; molecules are purely presentational; atoms are the smallest reusable units.

---

## Known Limitations & Future Improvements

- **No real backend** — all data is static JSON. Connecting a real API would require updating only `src/apis/*`.
- **No sorting/filtering** on the holdings table — column header clicks could add client-side sort.
- **No persistence** — selections are lost on page refresh; could be persisted to `localStorage`.
- **Tax rate calculation** — the savings figure shows the raw capital gains reduction, not the actual tax saved (which depends on the user's tax slab). A multiplier input would make this more accurate.
- **No unit tests** — the pure functions in `capitalGains.js` are structured to be testable with Vitest; tests were omitted for brevity.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 + Vite 6 | UI framework + build tool |
| Tailwind CSS 3 | Utility-first styling |
| @tanstack/react-query 5 | Server state / data fetching |
| clsx + tailwind-merge | Conditional class merging (`cn()`) |
| Vercel | Deployment (SPA rewrite via `vercel.json`) |
