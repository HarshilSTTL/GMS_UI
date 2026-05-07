# GMS UI — Project Overview

**Project:** Gujarat Grievance Management System (GMS) v3.0
**Stack:** Next.js 16.2.5 · React 19 · TypeScript 5 · Tailwind CSS v4 · shadcn/ui
**Status:** Base Architecture Complete — Phase 1 Done
**Last Updated:** 2026-05-07

---

## Objective

Convert 6 HTML demo files into a production-ready, enterprise-grade Next.js application while preserving the original UI/UX structure as closely as possible.

### HTML Reference Files
| File | Purpose |
|---|---|
| `GMS_Officer_Portal_v2.html` | Primary reference — sidebar, layout, officer portal |
| `Gujarat_CM_Dashboard_v2.html` | CM Intelligence dashboard |
| `Admin Console - Standalone (1).html` | Admin console |
| `Swagat 3.0 - Standalone (3).html` | Swagat citizen portal |
| `Swagat 3.0 Mobile - Merged (2).html` | Mobile Swagat portal |
| `CitizenVoice_WhatsApp_v1.html` | WhatsApp citizen channel |

---

## Current Implementation Status

### ✅ Phase 1 — Base Architecture (Complete)

| Component | Status | Notes |
|---|---|---|
| Design System (CSS vars, colors, typography) | ✅ Done | GMS-branded palette in globals.css |
| TypeScript Types | ✅ Done | auth, navigation, complaint types |
| Mock Data Layer | ✅ Done | users, nav, complaints, notifications |
| Zustand Stores | ✅ Done | auth-store, ui-store |
| Main Layout (AppShell) | ✅ Done | Sidebar + Topbar + content wrapper |
| Sidebar Component | ✅ Done | Role-based, dynamic JSON, collapsible |
| Topbar Component | ✅ Done | Search, notifications dropdown, user menu |
| Login Page | ✅ Done | Mock auth with demo accounts |
| AuthGuard | ✅ Done | Protected routes with role checking |
| Officer Dashboard | ✅ Done | KPI strip, priority queue table |
| All Complaints Page | ✅ Done | Full table, search, status/priority filters |
| My Work Queue | ✅ Done | Tabbed view, complaint action cards |
| Escalations Page | ✅ Done | Escalated + SLA breach lists |
| Grouped Cases | ✅ Done | AI suggestion, grouped view |
| Team Page | ✅ Done | Officer workload cards |
| SLA Reports | ✅ Done | KPIs + department breakdown |
| Reassign / Route | ✅ Done | Department picker + officer selector |
| CM Overview Dashboard | ✅ Done | State-wide KPIs, dept performance |
| Admin Overview | ✅ Done | System stats, user list |
| Root redirect | ✅ Done | Role-based redirect on login |

### 🔄 Phase 2 — Pending (Next Steps)

- Complaint detail page (full timeline, work log, communication log)
- Swagat 3.0 portal conversion
- WhatsApp CitizenVoice module
- Admin console full implementation (user management, roles, channels)
- CM dashboard remaining views (Districts, CSAT, Trends, AI Action Board)
- Form validation (react-hook-form + zod)
- Toast notifications for actions
- Complaint create/submit form

---

## Route Architecture

```
/                   → Redirect (role-based)
/login              → Login page (public)
/unauthorized       → Access denied page
/portal/dashboard   → Officer Portal dashboard
/portal/complaints  → All complaints list
/portal/my-work     → My work queue
/portal/grouped     → Grouped cases
/portal/escalations → Escalations
/portal/team        → My team
/portal/reports     → SLA reports
/portal/reassign    → Reassign/route
/cm/overview        → CM Intelligence dashboard
/admin/overview     → Admin console
```

---

## Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Nodal Officer | ravi.varma@gujarat.gov.in | officer123 |
| Clerk | anita.sharma@gujarat.gov.in | clerk123 |
| Admin | bhupesh.patel@gujarat.gov.in | admin123 |
| CM | cm.office@gujarat.gov.in | cm123 |
