# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common commands
- `npm install` (install dependencies once after cloning).
- `npm run dev` (launch Vite dev server with hot reload).
- `npm run build` (type-check via `vue-tsc` and produce Vite production bundle).
- `npm run preview` (serve the production build locally for smoke testing).
- `npm run lint` (run ESLint over Vue/TS files; respects `.gitignore`).
- `npm run format` (run Prettier on the entire repo).
- `npm run test` (run all Vitest suites once).
- `npm run test:watch` (keep Vitest running in watch mode during development).
- `npm run typecheck` (run `vue-tsc --noEmit`).
- Run a single test with `npm run test -- tests/stores/company.store.spec.ts` (or pass any other Vitest path).

## High-level architecture
- **Entry point:** `src/main.ts` wires up Vue 3 + Vite, registers Pinia, Vue Router, Element Plus, i18n, and globally registers Element Plus icons before mounting `App.vue`. Development-only logging prints the app version from `src/constants/index.ts`.
- **Routing & navigation:** `src/router/index.ts` defines lazy-loaded view components for `/dashboard`, `/calendar`, `/interviews`, `/companies`, `/analysis`, `/settings`, and the catch-all `NotFound`. Metadata (`title`, `icon`, `showInNav`) drives the sidebar and page titles; helper exports `navMenus`, `getRouteTitle`, and `isActiveRoute` support shared navigation components.
- **Layout & shared UI:** `src/components/layout` contains `AppLayout.vue`, `AppHeader.vue`, and `AppSidebar.vue` that compose the shell shown across routes. Shared widgets like `LanguageSwitcher.vue`, dashboard cards, offer charts, and upcoming interviews live under `src/components` and are reused by the views.
- **Views & features:** Each route maps to a Vue view under `src/views/`. `Dashboard.vue` renders the cards, charts, and upcoming interviews described in the README design doc. `InterviewList.vue`, `InterviewForm.vue`, and `InterviewDetail*.vue` implement the interview management workflow, while `CompanyList.vue`, `Analysis.vue` (offer comparison + stats), `Calendar.vue`, and `Settings.vue` follow the feature descriptions in `README.md` and `pages.md`.
- **State management:** Pinia stores live in `src/stores` (`company.ts`, `interview.ts`, `round.ts`, `user.ts`). Tests under `tests/stores/` (e.g., `company.store.spec.ts`) cover the stores; Vitest + jsdom are configured via `vitest.config.ts`.
- **Data models:** Follow the README-defined models (`Company`, `InterviewProcess`, `InterviewRound`, `UserProfile`) and the centralized enums/constants (e.g., `ROUND_STATUS`, `APP_VERSION` in `src/constants/index.ts`). These models surface across stores, forms, and analytics components.
- **Utilities:** `src/utils` contains helpers for storage persistence (`storage.ts`), status mapping (`statusMapping.ts`), test data (`testData.ts`), and error handling (`errors.ts`), which the stores and views import.
- **Internationalization:** `src/i18n` (detailed in `INTERNATIONALIZATION.md`) configures Vue I18n with `zh.ts`/`en.ts` and exports helpers such as `setLocale`. `LanguageSwitcher.vue` lets users switch locales while settings persist the preference.
- **Styling & themes:** Global styles reside in `src/styles` (Base/Element styles, variables, utilities) and follow the orange/blue visual language described in `pages.md`. Component styles are scoped within their `.vue` files when needed.
- **Build tooling:** Vite handles bundling (`vite.config.ts`), Element Plus integrates via CSS imports, and Vitest runs unit tests. Assets such as `src/assets/images/logo.svg` are referenced from components and views.
- **Documentation references:** README and `pages.md` capture product goals, feature-driven view behaviors (dashboard stats, calendar interactions, company cards, analysis planner, settings), and data management expectations. Consult them when extending functionality or onboarding new routes/components.

## Additional notes
- `polyfill.cjs` and `.eslintrc.cjs` are present at the repo root and should remain in sync with tooling expectations when editing build/test configs.
- When updating routes, keep `navMenus` consistent so the sidebar and headers reflect navigation changes.
- Tests focus on Pinia stores; keep Vitest suites in `tests/stores/*.ts` aligned with the models and utilities defined under `src/`.
