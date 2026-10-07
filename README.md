# Praetor – Case Subjects

Prototype of the "Case subjects" screen of the Praetor law-firm system (take-home task). On a single case
(`/spisy/:caseId/subjekty`) the user manages subjects and their roles. There is no backend; the API is mocked in the
browser with [MSW](https://mswjs.io/).

![Cases](docs/spisy.png)

## Features

- case subjects grouped by role (client, counterparty, involved parties, deciding bodies)
- subject detail in a side panel
- add a subject to the case: pick an existing one, look it up in ARES, or create a new one
- edit the subject's link to the case (role, legal representative, case number, preferred contacts), quick role setup
- set the main client and main payer, remove a subject from the case
- subject card: basic data, economic subject, natural person, addresses, contacts, data box lookup
- client zone: users, permissions and roles

## Stack

React 19 (React Compiler), TypeScript, Vite, React Router, TanStack Query, Zustand, React Hook Form + Zod, Axios, MSW,
Sonner, lucide-react, custom SCSS modules, Vitest + Testing Library.

## Run

Requires Node.js (current LTS) and npm.

### Environment variables

| Variable            | Default | Description                                     |
| ------------------- | ------- | ----------------------------------------------- |
| `VITE_API_URL`      | `/api/` | API base URL                                    |
| `VITE_USE_MOCK_API` | `true`  | `false` disables MSW and calls the real API URL |

Mock data lives in `src/mocks/` and resets on page reload.

## Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | dev server                   |
| `npm run build`      | type check (`tsc -b`), build |
| `npm run preview`    | preview production build     |
| `npm run lint`       | ESLint                       |
| `npm run lint:fix`   | ESLint with auto-fix         |
| `npm run format`     | Prettier                     |
| `npm test`           | run tests once (Vitest)      |
| `npm run test:watch` | tests in watch mode          |

## Structure

```
src/
  app/          App, Layout, providers, router
  features/     caseSubjects, subjects, codelists
  mocks/        MSW: seed data, in-memory db, handlers
  pages/        pages and their tests
  services/     axios instance
  shared/       reusable components, hooks, utils
  styles/       reset, tokens (_variables.scss), global styles
  test/         test setup
```
