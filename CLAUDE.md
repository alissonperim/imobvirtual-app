# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A front-end-only prototype of **Imobvirtual**, a rent-management product with two user roles: `proprietario` (owner) and `inquilino` (tenant/renter). It implements the high-fidelity design board `Imobvirtual.dc.html` (Claude Design project). There is **no backend integration** — auth and all data are simulated client-side (see "Mock backend" below). A real NestJS/TypeORM API for this product exists in the sibling repo `../imobvirtual`, but nothing here calls it yet.

## Commands

```bash
pnpm install       # install dependencies
pnpm dev           # start Vite dev server
pnpm build         # tsc -b (project references) + vite build
pnpm preview       # preview a production build
pnpm lint          # oxlint (not eslint)
```

There is no test setup (no test runner configured, no test files).

## Architecture

**Stack**: Vite + React 19 + TypeScript + `react-router-dom` v7. No state library, no data-fetching library — plain React Context + `useState`.

### Routing and role separation (`src/App.tsx`)

Two independent route trees are gated by `ProtectedRoute` (`src/routes/ProtectedRoute.tsx`), which checks `currentUser.role` and redirects to the other role's home if mismatched:

- `/entrar`, `/entrar/codigo`, `/criar-conta`, `/criar-conta/codigo`, `/criar-conta/confirmacao` — public auth flow (`src/features/auth/`)
- `/painel/*` — owner app, wrapped in `OwnerLayout` (desktop sidebar shell, `src/features/owner/`)
- `/app/*` — tenant app, wrapped in `TenantLayout` (mobile bottom-tab shell, `src/features/tenant/`)

`RootRedirect` sends an unauthenticated visitor to `/entrar` and an authenticated one to `homePathFor(role)`.

### Mock backend (`src/lib/AuthContext.tsx`, `src/lib/DataContext.tsx`)

Both contexts hold all "server" state client-side and persist it to `localStorage` (`imobvirtual:auth:v1`, `imobvirtual:data:v1`):

- **Auth**: OTP is entirely simulated. `requestLoginOtp`/`requestSignupOtp` just start a `pendingAuth` countdown; `verifyOtp` treats the code `000000` as an expired-code error and `111111` as an invalid-code error, and any other code as success — matching the demo error-state screens in the design. Login matches typed email/phone against `DEMO_USERS` (`src/lib/mockData.ts`) or falls back to `DEMO_OWNER`; signup fabricates a new `User` from the in-progress `SignupDraft`.
- **Data**: `DataProvider` seeds `imoveis`/`contratos`/`cobrancas`/`chamados`/`alertas` from `mockData.ts` and exposes read helpers (`imovelById`, `cobrancasByInquilino`, …) plus the only real mutations: `payCobranca`, `signContrato`, `addChamado`. `payCobranca` also flips a property back to `ocupado` if it has no other late charges — that cross-entity side effect lives here, not in the UI.
- When wiring this to the real API eventually, these two contexts are the seam: same consumer-facing hooks (`useAuth()`, `useData()`), swap the implementation behind them.

`ToastContext` (`src/lib/ToastContext.tsx`) is a third, simpler context for transient confirmation messages (e.g. after paying a charge).

### Testing with mock data

There's no route-to-route data passing (no `useParams`, no route state) — every page reads the "current" entity straight out of `DataContext` by matching `currentUser.id` from `AuthContext` (e.g. `cobrancasByInquilino(currentUser.id)`, `contratoByInquilino(currentUser.id)`).

- **Owner**: any e-mail/phone that isn't Mariana's logs you in as `DEMO_OWNER` ("Ricardo Souza") — e.g. type anything at `/entrar`. Owner pages read `imoveis`/`contratos`/`cobrancas` unfiltered (there's no `ownerId` on `Imovel`), so every owner login sees the same single portfolio — a new owner signup isn't empty, it just isn't scoped to "their" properties, because the dataset has no concept of more than one owner.
- **Tenant**: use `mariana.alves@email.com` or `(11) 98812-4477` (`DEMO_TENANT`) to see a fully populated dashboard/invoices/contract/tickets straight away.
- **Freshly signed-up tenant**: also fully testable, not an empty state. `DataProvider` watches `currentUser` (`ensureTenantOnboarded` in `DataContext.tsx`) and, the first time an `inquilino` with no contract shows up, either claims the pre-seeded unclaimed unit (`ct-aurora-novo` / `im-aurora`, status `aguardando_assinatura`) or — if that's already taken by an earlier test signup this session — fabricates a fresh property+contract pair (`im-novo-<id>` / `ct-novo-<id>`) with the same shape. Either way the new tenant lands with a contract to sign at `/app/contrato`; signing it (`signContrato`) flips the property to `ocupado` and generates its first `pendente` invoice (due in 7 days) so `/app/pagar` has something to pay too.
- Any OTP code works **except** `000000` (simulates an expired code) and `111111` (simulates an invalid code) — those two exist specifically to drive the design's error-state screens.

**Known gap**: signing up through `/criar-conta` creates a brand-new `User` with a fresh id (`u-${Date.now()}`) that matches nothing in `mockData.ts`, so that path always lands on an empty dashboard — this is expected, not a bug. Likewise `Imovel` has no `ownerId` field; the dataset assumes a single implicit owner, so every owner login sees the same property list.

### Design system

`src/styles/tokens.css` defines every color/spacing/radius/shadow CSS variable (`--color-*`, `--space-*`, `--radius-*`, `--shadow-*`) copied from the Imobvirtual design board — dark navy (`--color-text` / `--color-accent-2` ramp) + emerald accent (`--color-accent` ramp), Plus Jakarta Sans throughout. `src/styles/components.css` defines global utility classes on top of those tokens: `.btn`/`.btn-primary`/`.btn-secondary`/`.btn-ghost`/`.btn-danger`/`.btn-icon`/`.btn-block`, `.field`/`.input`/`.field-hint`/`.field-error`, `.tag` + status modifiers (`st-paid`, `st-pend`, `st-late`, `tag-neutral`, `tag-outline`), `.card`, `.seg`/`.seg-opt`. Both are imported once in `src/index.css`.

**Styling convention**: reach for the global classes above first (they carry the theming and hover/focus states already). Layout-specific structure (sidebars, grids, responsive breakpoints for a specific page/layout) goes in a co-located CSS Module (`Foo.module.css` next to `Foo.tsx`) — see `OwnerLayout.module.css`, `TenantLayout.module.css`, `AuthLayout.module.css`. One-off positioning tweaks are inlined as `style={{ ... }}` rather than added to the stylesheet. Status badges always go through the `*StatusTag` components in `src/components/StatusTag.tsx` (one per status enum: `Imovel`, `Contrato`, `Cobranca`, `Chamado`) rather than switching on status ad hoc in page code.

Icons are `lucide-react`, generally `strokeWidth={2.5}` or `2.75` to match the design's heavier line weight.

### Domain types (`src/lib/types.ts`)

All domain vocabulary is in Portuguese and mirrors the design/API terms: `Role` (`proprietario`/`inquilino`), `Imovel` (property) with `ImovelStatus` (`ocupado`/`vago`/`atraso`/`a_vencer`), `Contrato` (lease) with `ContratoStatus` and an `eventos` timeline (signature progress steps), `Cobranca` (invoice/charge) with `CobrancaStatus` and `MetodoPagamento` (`pix`/`boleto`), `Chamado` (maintenance ticket) with `ChamadoCategoria`/`ChamadoUrgencia`/`ChamadoStatus`. When adding a field or status value, update the type here first, then `mockData.ts`, then the relevant `*StatusTag` map.

### Feature folder layout

`src/features/{auth,owner,tenant}/` — one folder per flow, each page is a default-exported `*Page.tsx`. Shared cross-feature widgets (`Logo`, `Dialog`, `OtpInput`, `SegmentedControl`, `StatusTag`) live in `src/components/`. `src/lib/format.ts` holds the only formatting helpers (`formatBRL`, `formatBRLParts`, `initials`) — use them instead of ad hoc `toLocaleString` calls.

## Related repo

`../imobvirtual` is the real backend (NestJS + TypeORM + Postgres, Clean Architecture) for this same product. Its `SPEC.md` documents the full rent-management domain (invoices, contracts, signatures, maintenance, adjustments) this prototype's mock data stands in for. `owners`/`properties` are fully implemented there; `renters`/`rental-contracts` are stubs; invoices/tickets/signatures don't exist yet.
