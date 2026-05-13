# GMS Project Memory

## Design System (from GMS_Officer_Portal_v2.html)

### Colors
- **Brand Blue**: #1A56C4 (primary actions)
- **Dark**: #0E1C2F (text/ink)
- **Text Secondary**: #3D5068 (t2)
- **Text Tertiary**: #7A8FA6 (t3)
- **Border**: #DDE3EE
- **Red**: #DC2626 | Light: #FEF2F2
- **Green**: #16A34A | Light: #F0FDF4
- **Amber**: #D97706 | Light: #FFFBEB
- **Orange**: #EA580C | Light: #FFF7ED
- **Violet**: #7C3AED | Light: #F5F3FF

### Status Badges
- `.st-open`: red (#FEE2E2, #991B1B)
- `.st-progress`: amber (#FEF3C7, #92400E)
- `.st-review`: blue (#DBEAFE, #1E40AF)
- `.st-resolved`: green (#D1FAE5, #065F46)
- `.st-escalated`: violet (#EDE9FE, #5B21B6)

### Priority Badges
- `.pri-critical`: #FEE2E2, #991B1B
- `.pri-high`: #FEF3C7, #92400E
- `.pri-medium`: #DBEAFE, #1E40AF
- `.pri-low`: #F1F5F9, #475569

### Buttons
- `.tt-btn`: Primary button (brand blue, shadow)
- `.tt-btn-ghost`: Outline button
- `.tt-btn-orange`: Orange action button
- `.tt-btn-violet`: Violet action button

### Spacing & Radius
- Border radius: 14px (r-lg), 10px (r), 7px (r-sm)
- Shadow: `0 1px 3px rgba(14,28,47,0.08),0 4px 16px rgba(14,28,47,0.06)`

### Font
- Display: 'Syne' (font-weight: 700)
- Body: 'Epilogue'

---

## Project Status

### Completed ✅
- Workflow Configuration (JSON + CRUD + Design System)
- Escalation Matrix (JSON + CRUD + Design System)
- Notifications (JSON + CRUD + Design System)
- All three pages now use exact design system colors and inline styles

### Design System Implementation (Latest)
All three admin pages updated to use:
- Exact color constants (brand: #1A56C4, red: #DC2626, etc.)
- Inline styles instead of Tailwind classes
- Matching card layouts, shadows, spacing
- Consistent button styling (tt-btn class for primary actions)
- Status badges with exact colors
- Modal dialogs matching design

### Next: Test all pages in browser and verify visual match
