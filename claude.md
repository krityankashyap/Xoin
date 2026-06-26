# CLAUDE.md

## Project: KoinX Tax Loss Harvesting Tool

A responsive React tool that shows a user's pre-harvesting and post-harvesting
capital gains, lets them select holdings to "harvest," and recalculates tax
impact in real time. Built as a frontend-intern assignment — mock APIs only,
no real backend.

This project follows the same architectural pattern as the reference
`Message-Slack-Frontend` codebase: layered API mocks → React Query hooks →
Atomic Design components → Context for cross-cutting state → route-level pages.

## Stack
- React + Vite
- Tailwind CSS (+ shadcn/ui primitives where useful — dialogs, tooltips, checkbox)
- TypeScript (preferred; plain JS acceptable if time-constrained — be consistent, don't mix)
- @tanstack/react-query for the mocked "data fetching" layer
- Path aliases via `vite.config` / `tsconfig`/`jsconfig` (`@/...`)
- Deployed on Vercel (SPA rewrite, like the reference `vercel.json`)

## Architecture rules (follow strictly)

### 1. Mock API layer separation
Even though there is no real backend, keep the same boundary as a real app would:

- `src/apis/holdings/index.js(ts)` — exports `getHoldings()`, returns a
  `Promise` that resolves with the holdings array (via `setTimeout` or a fixed
  delay) from a local fixture at `src/mocks/holdings.json`.
- `src/apis/capitalGains/index.js(ts)` — exports `getCapitalGains()`, same
  pattern, backed by `src/mocks/capitalGains.json`.
- Never inline fetch/promise logic in components. Components/pages never touch
  `src/mocks/*` directly.

### 2. Data-fetching hooks
- `src/hooks/apis/holdings/useGetHoldings.js(ts)` — wraps `getHoldings()` in
  `useQuery`.
- `src/hooks/apis/capitalGains/useGetCapitalGains.js(ts)` — wraps
  `getCapitalGains()` in `useQuery`.
- Components only ever import from `hooks/apis/*`, never from `apis/*` directly.
- These hooks return `{ data, isLoading, isError }` — every consumer must
  handle loading/error states (skeleton or spinner, not a blank screen).

### 3. Business logic stays out of components
- All capital-gains math (net gains, realised gains, post-harvesting
  recalculation, savings check) lives in pure, unit-testable functions in
  `src/utils/capitalGains.js(ts)`. Components call these functions; they never
  reimplement the arithmetic inline in JSX.
- Required pure functions (exact names, keep signatures predictable):
  - `getNetGain({ profits, losses }) => number`
  - `getRealisedGain(capitalGains) => number` (sum of net stcg + net ltcg)
  - `applyHarvestSelection(baseCapitalGains, selectedHoldings) => updatedCapitalGains`
    — for each selected holding: stcg.gain > 0 → add to `stcg.profits`,
    stcg.gain < 0 → add abs value to `stcg.losses`; same for ltcg. Returns a
    **new** object — never mutate the base API response.
  - `getSavings(preRealised, postRealised) => number | null` — returns the
    difference only when `preRealised > postRealised`, otherwise `null` (UI
    hides the savings banner on `null`).
- Write these as plain functions with no React/DOM dependency so they can be
  unit-tested in isolation (Vitest/Jest).

### 4. State management
- Selection state (which holding IDs are checked) is the one piece of
  cross-cutting client state in this app → goes in a Context:
  `src/context/HarvestingContext.jsx`, consumed only via
  `src/hooks/context/useHarvesting.js`. Never `useContext` directly in a
  component.
- The context holds: `selectedIds: Set<string>`, `toggleHolding(id)`,
  `toggleAll(allIds)`, `isAllSelected`, and derives `selectedHoldings` from the
  holdings query data + `selectedIds`.
- Server/query state (`holdings`, `capitalGains`) stays in React Query's cache
  — do not copy it into Context or component state.
- If more providers are added later, compose them via
  `src/utils/combineContext.jsx` (same helper pattern as the reference repo) —
  don't hand-nest providers in `App.jsx`.

### 5. Component hierarchy (Atomic Design — mirror the reference repo exactly)

- `components/atoms/`
  - `CoinIcon/CoinIcon.jsx` — logo + fallback for broken/missing image
  - `GainValue/GainValue.jsx` — formats a ₹ gain with sign + green/red color
  - `Checkbox/Checkbox.jsx` — thin wrapper over shadcn checkbox if used
  - `StatRow/StatRow.jsx` — a single "Profits / Losses / Net" line item
- `components/molecules/`
  - `CapitalGainsCard/CapitalGainsCard.jsx` — one card (pre or post), takes
    `variant: "pre" | "post"` and a `capitalGains` shape as props; purely
    presentational, no data fetching, no math
  - `SavingsBanner/SavingsBanner.jsx` — "You're going to save ₹X" banner
  - `HoldingsTableRow/HoldingsTableRow.jsx` — one row, checkbox + all columns
  - `HoldingsTableHeader/HoldingsTableHeader.jsx` — column headers + select-all checkbox
- `components/organisms/`
  - `CapitalGainsSection/CapitalGainsSection.jsx` — lays out Pre + Post cards
    side by side (stacked on mobile), owns the "compute post-harvest figures"
    call into `utils/capitalGains.js`
  - `HoldingsTable/HoldingsTable.jsx` — fetches via `useGetHoldings`, renders
    header + rows, wires checkboxes to `useHarvesting`
- `components/ui/` — shadcn/ui primitives only (checkbox, tooltip, skeleton),
  unmodified beyond what the generator produces.
- `pages/TaxHarvesting/TaxHarvesting.jsx` — the single route-level page,
  composes `CapitalGainsSection` + `HoldingsTable` inside a layout shell.
  Pages never contain raw markup-heavy UI themselves.

### 6. Routing
- Single route is fine for this assignment (`/`), defined centrally in
  `src/Routes.jsx`, matching the reference repo's centralized routing
  convention even though there's only one page.

### 7. Styling
- Tailwind utility classes; use `cn()` (`src/lib/utils.js`) for conditional
  class merging.
- Two-card layout: Pre-Harvesting = dark background, After Harvesting = blue
  background, per the Figma. Match spacing/typography tokens from Figma as
  closely as possible — open the file in Figma (Dev Mode/Inspect, or a Figma
  MCP connector if available) to pull exact colors, radii, and font sizes
  rather than guessing.
- Must be responsive: cards stack vertically and the holdings table becomes
  horizontally scrollable (not crushed) below the tablet breakpoint.

### 8. Numeric formatting (important — the mock data has extreme values)
- Some holdings have values like `3.4e-17` or `8.6e-7`. Never render raw
  scientific notation or `0.00000000000003` strings.
  - Currency (₹): `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })`.
  - Token amounts: format with a sensible max of 6–8 significant decimals,
    and collapse anything below a tiny threshold (e.g. `< 0.000001`) to
    `< 0.000001` rather than printing the float.
  - Put this in a shared `formatCurrency()` / `formatTokenAmount()` helper in
    `src/utils/format.js`, reused by every component — don't format inline
    per-component.
- The mock holdings list contains two separate `USDC` entries (different
  `coinName`/bridge). Treat each array entry as its own row — key rows by
  array index or a generated id, never by `coin` symbol alone.

## When implementing a feature
1. Add/extend the mock in `src/apis/<domain>/index.js` + its fixture in `src/mocks/`.
2. Add the React Query hook in `src/hooks/apis/<domain>/`.
3. Add any new pure calculation to `src/utils/capitalGains.js` (and a test).
4. Build atoms → molecules → organisms.
5. Wire into `TaxHarvesting.jsx`; register route in `Routes.jsx` if new.
6. If new shared client state is needed, add a Context + matching
   `hooks/context` hook.

## Don'ts
- Don't fetch or compute inside JSX render bodies — derive once, render the result.
- Don't mutate React Query cache data when computing post-harvest figures —
  always derive a new object.
- Don't put the harvesting math in the component layer "just for now" —
  it has to be unit-testable from day one.
- Don't ship the project without handling the loading and empty/error states
  for both mock API calls.
- Don't introduce Redux/Zustand — Context + React Query is the established
  pattern here, same as the reference repo.