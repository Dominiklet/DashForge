# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # tsc -b (project references) + vite build
npm run lint      # eslint .
npm run preview   # preview the production build
npm test          # vitest run (all tests, jsdom environment)
```

Run a single test file: `npx vitest run src/App.test.tsx`
Run tests matching a name: `npx vitest run -t "rendert ohne Fehler"`

The repo has both `package-lock.json` and `pnpm-lock.yaml`; `npm` is the one actually used in scripts/CI-equivalent workflows (`start.bat`), so prefer `npm` unless told otherwise.

### Mock server (optional, for realistic data fetching instead of static JSON imports)

`src/mock-server/` contains a Dockerfile that runs `json-server` over `src/mock-server/mockData.json` on port 3000. `start.bat` builds/runs that container and then launches `npm run dev`. This is not currently wired into the app (data is imported directly from `src/mock data/*.json`), so treat it as infrastructure for a future data-fetching layer, not something the app currently depends on.

## Architecture

DashForge is a React + TypeScript + Vite frontend that renders a **dashboard of widgets** from a JSON configuration format modeled on an external monitoring platform's dashboard/panel schema (see `src/templates/*.json` for the canonical shape and `resources/*.pdf` for the underlying design concepts: mock-server setup, chart-library evaluation, widget-positioning concept).

Key layers:

- **Templates** (`src/templates/*.json`): reference/example payloads for a full dashboard (`dashboard_template.json`) and individual panel types (`kpi_template.json`, `strompreis_template.json`, `strompreis_metadata_template.json`). A dashboard has top-level metadata (`name`, `nodeInformation.explorerPath`, `timeRange`, `refreshInterval`, ...) and a `panels[]` array. Each panel has a `panelType` (`PLOT`, `KPI`, `TEXT`, `IMAGE`), a `panelStyle` (background/text color, margins), a `panelConfiguration` (shape depends on `panelType`), a `layoutPos` (grid `x`/`y`/`w`/`h`), and `dataSourceOutputs` mapping output IDs to backend signal references. This template format is the source of truth for what a real backend would eventually send; the app doesn't yet consume it dynamically (see below).
- **Mock data** (`src/mock data/*.json`): standalone `{timestamp, value}[]` timeseries plus a matching `*_metadata.json` (name/unit/date range/timezone) per signal (`einspeisung`, `geschwindigkeit`, `netzspannung`, `strompreis`, `windgeschwindigkeit_prognose`), plus `markdown.json` and `kpi.json`. `App.tsx` imports these by filename and assembles them into the `DataSources` map (see below) rather than driving panels from `dashboard_template.json` directly — the app is still mid-migration from "hardcoded mock imports" toward "driven by the dashboard/panel JSON schema" (see branch name `47-dashboard-refactoring`).
- **Data context** (`src/context/`): widget *values* (timeseries + markdown code) are decoupled from widget *layout* via React Context, split across three files to satisfy the `react-refresh/only-export-components` lint rule (a file may only export components, not a mix of components/hooks/constants):
  - `DataContext.ts` — the `DataContext` object itself plus the `DataSource`/`DataSources`/`TimeseriesMetadata` types. A `DataSource` is a discriminated union (`{ type: "timeseries", data, metadata }` or `{ type: "markdown", code }`).
  - `DataProvider.tsx` — the `<DataProvider dataSources={...}>` component that supplies a `DataSources` map (keyed by an arbitrary string id, e.g. `"strompreis"`, `"markdown"`) to the tree.
  - `useDataSource.ts` — the `useDataSource(id)` hook widgets call to read their own entry out of context; throws if called outside a `DataProvider`.
  Layout (title, panelStyle, showPanelBar, which id to read) still flows down as props from `App.tsx` → `Dashboard.tsx` → widget; only the actual data value bypasses `Dashboard.tsx` and is pulled directly from context inside each widget.
- **Widget components** (`src/components/`): `WidgetBase` is the shared chrome for every panel — renders the optional title bar (`showPanelBar`), applies `PanelStyle` (background color/opacity via `hexToRgba`, text color, margins unless `selfManagedMargins`), and shows a "Keine Daten verfügbar" empty state when `hasData` is false. `KpiWidget`, `TextWidget` (Markdown via `react-markdown` + `rehype-raw`), and `PlotWidget` (chart rendering via `recharts`, currently a thin pass-through pending real implementation) each wrap `WidgetBase` with panel-type-specific rendering logic. Every widget takes a `dataSourceId: string` prop (plus `title`/`panelStyle`/`showPanelBar`) and resolves it via `useDataSource` internally rather than receiving data as props. New widget types should follow this same pattern: accept layout props + `dataSourceId`, call `useDataSource`, compute `hasData`, and delegate chrome to `WidgetBase`.
- **Shared types** (`src/types/panel.ts`): `PanelStyle`, `WidgetBaseProps`, and `DataPoint` (`{timestamp, value}`) are the shared contract every widget's props/data extend/embed. `defaultPanelStyle` is the all-null default.
- **`Dashboard.tsx`**: the layout layer between `App.tsx` and the widgets. Owns the fullscreen container/toggle (Fullscreen API) and the header bar (icon, name, explorer path), and renders the widget grid. Receives only layout data as props (`name`, `explorerPath`, per-widget titles, `dataSourceId`s, `kpiFractionDigits`) — no timeseries/markdown values pass through it.
- **`App.tsx`**: top-level composition root — reads dashboard name/explorer path from `dashboard_template.json`, builds the `DataSources` map from the mock data imports, wraps `Dashboard` in `<DataProvider>`, and passes layout props down to `Dashboard`.

### Styling

Plain CSS files per component (no CSS-in-JS/Tailwind). Global design tokens (`--text`, `--text-h`, `--bg`, `--border`, `--code-bg`, `--accent`) and the `Open Sans` font-face declarations live in `src/index.css`; component CSS (e.g. `WidgetBase.css`) consumes those `var(...)` tokens rather than hardcoding colors, so match that convention for new widget styles. UI copy/labels are in German (e.g. "Keine Daten verfügbar", "Letzter Preis") — keep new user-facing strings consistent with that.

### Testing

Vitest + `@testing-library/react` + jsdom (config in `vite.config.ts`, setup in `src/test/setup.ts` which just loads `@testing-library/jest-dom`). Test files sit next to source as `*.test.tsx`.
