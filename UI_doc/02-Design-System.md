# Design System

## Color Palette

The GMS design system uses a deep navy + professional blue palette derived from `GMS_Officer_Portal_v2.html`, refined for consistency.

### Core Colors

| Token | Value | Usage |
|---|---|---|
| `--background` | `#F0F2F7` | Page background |
| `--card` | `#FFFFFF` | Card surfaces |
| `--brand` | `#1A56C4` | Primary brand blue |
| `--brand-dark` | `#0E3A8C` | Brand hover state |
| `--brand-light` | `#EBF2FF` | Brand tinted background |
| `--sidebar` | `#0E1C2F` | Sidebar background (deep navy) |
| `--ink` | `#0E1C2F` | Primary text |
| `--ink-2` | `#3D5068` | Secondary text |
| `--ink-3` | `#7A8FA6` | Tertiary / placeholder text |
| `--border` | `#DDE3EE` | Border color |

### Semantic Colors

| Token | Value | Usage |
|---|---|---|
| `--success` | `#16A34A` | Resolved, on-time |
| `--success-light` | `#F0FDF4` | Success backgrounds |
| `--warning` | `#D97706` | SLA warn, high priority |
| `--warning-light` | `#FFFBEB` | Warning backgrounds |
| `--danger` | `#DC2626` | SLA breach, critical |
| `--danger-light` | `#FEF2F2` | Danger backgrounds |
| `--info` | `#0891B2` | Info, teal accent |

---

## Typography

- **Primary font:** Inter (loaded via `next/font/google`)
- **Font variable:** `--font-inter`
- Font weights used: 300, 400, 500, 600, 700, 800

### Type Scale (from HTML reference)
| Element | Size | Weight |
|---|---|---|
| Page title | 20px | 700 |
| Card/section title | 13–15px | 700 |
| Table headers | 10px | 700 (uppercase) |
| Body text | 12px | 400–500 |
| Meta/sub text | 10–11px | 400 |
| Complaint token | 11px | 700 (monospace) |

---

## Spacing & Radius

- **Border radius:** `--radius: 0.625rem` (10px)
- `--radius-sm`: 6px
- `--radius-lg`: 14px (cards)
- Page content padding: `20px 24px`
- Card padding: `14px 16px`

---

## Badge System

### Status Badges
| Status | Background | Text |
|---|---|---|
| Open | `#FEE2E2` | `#991B1B` |
| In Progress | `#FEF3C7` | `#92400E` |
| Under Review | `#DBEAFE` | `#1E40AF` |
| Resolved | `#D1FAE5` | `#065F46` |
| Escalated | `#EDE9FE` | `#5B21B6` |
| Acknowledged | `#FEF9C3` | `#78350F` |

### Priority Badges
| Priority | Background | Text |
|---|---|---|
| Critical | `#FEE2E2` | `#991B1B` |
| High | `#FEF3C7` | `#92400E` |
| Medium | `#DBEAFE` | `#1E40AF` |
| Low | `#F1F5F9` | `#475569` |

### Channel Badges
| Channel | Background | Text |
|---|---|---|
| Web | `#EBF2FF` | `#1E40AF` |
| Mobile | `#ECFEFF` | `#0E7490` |
| WhatsApp | `#DCFCE7` | `#166534` |
| Call | `#FFF7ED` | `#9A3412` |
| Email | `#F5F3FF` | `#5B21B6` |
| Walk-in | `#FEF3C7` | `#92400E` |

---

## Sidebar Design

- Width: 220px (expanded), 56px (collapsed)
- Background: `#0E1C2F` (deep navy)
- Active item: `rgba(26,86,196,0.25)` background + `2px left border` in brand blue
- Section labels: 9px, uppercase, `rgba(255,255,255,0.25)`
- Item text: 12px, `rgba(255,255,255,0.5)` → `white` on hover/active
