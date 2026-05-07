# Architecture Decisions

## State Management — Zustand

**Decision:** Use Zustand over Redux/Context API.
**Why:** Lightweight, no boilerplate, easy to persist with `zustand/middleware`. GMS doesn't need Redux's complexity.

### Stores
- `useAuthStore` — Persisted via `localStorage` (key: `gms-auth`). Stores user, token, isAuthenticated.
- `useUIStore` — Non-persisted. Stores sidebar state, active nav ID, search query.

---

## Authentication — Mock-first

**Decision:** Start with `mockLogin()` in `src/data/mock-users.ts`, structured so only the service layer changes when real APIs arrive.

**Pattern:**
```
LoginPage → useAuthStore.login() → mockLogin(credentials) → returns {user, token}
```

When real API is ready: replace `mockLogin()` with `axios.post('/api/auth/login')` — no component changes needed.

---

## Navigation — Role-based JSON Config

**Decision:** Sidebar menus are defined in `src/data/mock-nav.ts` as typed `NavSection[]` arrays per role.

**Pattern:**
```ts
const sections = getNavForRole(user.role);  // Returns NavSection[] for current role
```

Each role gets completely different navigation — nodal_officer, clerk, admin, cm, citizen.

---

## Routing — Next.js App Router

**Decision:** Use App Router (Next.js 16 `src/app/` structure) with layout-level `AuthGuard`.

**Pattern:** Each area (`/portal`, `/cm`, `/admin`) has its own `layout.tsx` that wraps children in `AuthGuard` with role restrictions.

---

## Mock Data → API Migration Path

The data layer in `src/data/` should be replaced with service functions:

```
src/data/mock-complaints.ts  →  src/services/complaints.service.ts
src/data/mock-users.ts       →  src/services/auth.service.ts
src/data/mock-nav.ts         →  (stays static, or becomes /api/navigation)
```

Components import from `@/data` and don't know if data is mock or real.

---

## Component Structure

- `src/components/layout/` — App shell (Sidebar, Topbar, AppShell)
- `src/components/gms/` — GMS-specific reusable components (badges, KPI cards)
- `src/components/auth/` — Auth utilities (AuthGuard)
- `src/components/ui/` — shadcn/ui base components (never modify directly)

---

## Responsive Strategy

- Sidebar: fixed+hidden on mobile, slide-in via `sidebarMobileOpen` state, always visible `lg:` and up
- Tables: hide lower-priority columns at smaller breakpoints (`hidden md:table-cell`, `hidden lg:table-cell`)
- KPI grid: 2 cols on mobile → 3 on sm → 5 on lg
- Dashboard main layout: 1 col on mobile → 3-col grid on xl
