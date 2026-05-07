# Folder Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (Inter font, Toaster, TooltipProvider)
│   ├── page.tsx                  # Root redirect (role-based)
│   ├── globals.css               # GMS design system CSS variables + Tailwind
│   ├── login/
│   │   └── page.tsx              # Login page (mock auth, demo accounts)
│   ├── unauthorized/
│   │   └── page.tsx              # Access denied page
│   ├── portal/                   # Officer / Clerk portal
│   │   ├── layout.tsx            # Auth guard (nodal_officer, clerk)
│   │   ├── page.tsx              # Redirect → /portal/dashboard
│   │   ├── dashboard/page.tsx    # KPI strip + priority queue + team workload
│   │   ├── complaints/page.tsx   # All complaints (search, filter, table)
│   │   ├── my-work/page.tsx      # My work queue (card view, actions)
│   │   ├── grouped/page.tsx      # Grouped cases (AI suggestion)
│   │   ├── escalations/page.tsx  # Escalated + SLA breach lists
│   │   ├── team/page.tsx         # Team workload overview
│   │   ├── reports/page.tsx      # SLA reports + dept breakdown
│   │   └── reassign/page.tsx     # Reassign/route (dept + officer picker)
│   ├── cm/                       # CM Intelligence dashboard
│   │   ├── layout.tsx            # Auth guard (cm, admin)
│   │   └── overview/page.tsx     # State-wide KPIs + dept performance
│   └── admin/                    # Admin console
│       ├── layout.tsx            # Auth guard (admin)
│       └── overview/page.tsx     # System stats + user management
│
├── components/
│   ├── layout/                   # App shell components
│   │   ├── AppShell.tsx          # Main shell wrapper
│   │   ├── Sidebar.tsx           # Role-based, dynamic, collapsible
│   │   ├── Topbar.tsx            # Search, notifications, user menu
│   │   └── index.ts
│   ├── auth/
│   │   ├── AuthGuard.tsx         # Protected route wrapper
│   │   └── index.ts
│   ├── gms/                      # GMS-specific components
│   │   ├── StatusBadge.tsx       # Status, Priority, Channel, SLA badges
│   │   ├── KPICard.tsx           # KPI stat card with accent bar
│   │   └── index.ts
│   └── ui/                       # shadcn/ui base components (18 files)
│
├── data/                         # Mock data layer
│   ├── mock-users.ts             # User profiles + login function
│   ├── mock-nav.ts               # Role-based navigation config
│   ├── mock-complaints.ts        # Complaint records + KPI data
│   ├── mock-notifications.ts     # Notification records
│   └── index.ts
│
├── stores/                       # Zustand state management
│   ├── auth-store.ts             # Authentication state (persisted)
│   ├── ui-store.ts               # UI state (sidebar, search)
│   └── index.ts
│
├── types/                        # TypeScript interfaces
│   ├── auth.ts                   # User, UserRole, LoginCredentials
│   ├── navigation.ts             # NavItem, NavSection, SidebarConfig
│   ├── complaint.ts              # Complaint, KPIData, Officer, etc.
│   └── index.ts
│
├── hooks/
│   └── use-mobile.ts             # Mobile detection hook
│
└── lib/
    └── utils.ts                  # cn() class merger (clsx + twMerge)
```
