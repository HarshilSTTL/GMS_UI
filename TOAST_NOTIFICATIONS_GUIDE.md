# Grievance Action Toast Notifications — Testing Guide

## Overview
Toast notifications have been enhanced across all grievance action pages to provide clear, user-friendly feedback when actions are performed. Status badges now update in real-time.

## Test Accounts

### Officer (Portal)
- **Email**: ravi.varma@gujarat.gov.in
- **Password**: officer123
- **Role**: Nodal Officer

### Citizen (Citizen Portal)
- **Email**: demo.citizen@example.com
- **Password**: demo123
- **Phone**: 9123456789

---

## Portal Grievance Actions (Officer View)

**Navigate to**: `http://localhost:3000/portal/complaints`

### 1. ✅ Resolve a Grievance
**Action**: Click green "Resolve" button on grievance detail page

**Expected Toast**:
```
✅ Grievance resolved successfully
Survey link sent to citizen
```

**Verify**:
- Status badge changes to "Resolved" (green)
- Timeline shows "Grievance Resolved" entry
- Citizen receives notification

---

### 2. ⚠️ Escalate a Grievance
**Action**: Click orange "Escalate" button on detail page

**Expected Toast**:
```
⚠️ Grievance escalated to senior management
Citizen notified of escalation
```

**Verify**:
- Status badge changes to "Escalated" (red)
- SLA badge shows "Breach" status
- Timeline shows "Escalated" entry with reason

---

### 3. 👁️ Acknowledge a Grievance
**Action**: Click "✋ Acknowledge" button on detail page

**Expected Toast**:
```
👁️ Grievance acknowledged
Citizen notified via SMS
```

**Verify**:
- Status badge changes to "Acknowledged" (cyan)
- Acknowledge button disappears
- Yellow "Acknowledged" badge appears next to priority
- Citizen receives SMS notification

---

### 4. ✉️ Send Update to Citizen
**Action**: Fill "Update message to citizen" textarea and click "Send Update & Notify Citizen"

**Expected Toast**:
```
✉️ Update sent to citizen via {SMS/Email/SMS + Email/etc}
```

**Verify**:
- Message appears in timeline with icon 🔄
- Citizen receives notification via selected channels
- Update message is visible in timeline description

---

### 5. 🔄 Reassign Grievance (From Detail Page)
**Action**: Click orange "Reassign" button → Select new officer → Confirm

**Expected Toast**:
```
🔄 Reassigned to {Officer Name}
{Designation} · {Department}
```

**Verify**:
- Assigned Officer info updates on sidebar
- Timeline shows reassignment entry
- New officer receives assignment notification

---

## Escalations Page

**Navigate to**: `http://localhost:3000/portal/escalations`

### 1. Resolve Escalated Grievance
**Dialog**: Click "Take Action" on escalated complaint → Select "Mark as Resolved"

**Expected Toast**:
```
✅ Grievance marked as resolved
Citizen survey link sent
```

---

### 2. De-escalate Grievance
**Dialog**: Click "Take Action" → Select "De-escalate to In Progress"

**Expected Toast**:
```
↩️ Escalation withdrawn
Grievance back to in-progress status
```

---

### 3. Reassign from Escalations
**Dialog**: Click "Reassign Complaint" → Select officer → Confirm

**Expected Toast**:
```
🔄 Reassigned to {Officer Name}
{Designation} · {Department}
```

---

## Reassign Bulk Page

**Navigate to**: `http://localhost:3000/portal/reassign`

### 1. Quick Assign Single Grievance
**Action**: 
1. Select an officer from right panel
2. Click "Assign" on any grievance row

**Expected Toast**:
```
👤 Assigned to {Officer Name}
{Designation} · {Department}
```

---

### 2. Bulk Reassign Multiple
**Action**:
1. Check multiple grievances
2. Select officer and department
3. Click "Confirm Reassignment (N)"

**Expected Toast**:
```
↗ {N} grievance(s) reassigned to {Officer Name}
```

---

## Citizen Grievance Actions

**Navigate to**: `http://localhost:3000/citizen/grievances` (as demo citizen)

### 1. 🔓 Reopen Resolved Grievance
**Action**: On resolved grievance → Click "Reopen" → Fill reason → Confirm

**Expected Toast**:
```
🔓 Grievance reopened
Officer has been notified
```

**Verify**:
- Status changes back to "Pending"
- Feedback section hidden
- Officer gets notification to review

---

### 2. ⭐ Submit Feedback on Resolved
**Action**: On resolved grievance → Click "Rate & Feedback" → Select rating → Add comment

**Expected Toast**:
```
⭐ Thank you for your feedback
Your rating: {N}/5 stars
```

**Verify**:
- Rating stars display in grievance detail
- Feedback comment shows in green box
- Officer sees feedback in timeline

---

### 3. ⚠️ Escalate from Citizen View
**Action**: On pending/in-progress grievance → Click "Escalate" → Select reason

**Expected Toast**:
```
⚠️ Grievance escalated to higher authority
You will receive updates soon
```

**Verify**:
- Status changes to "Escalated" (red)
- Timeline shows escalation with citizen's reason
- Officer/Admin notified of escalation

---

### 4. 💬 Contact Officer
**Action**: Click "Contact Officer" → Type message → Send

**Expected Toast**:
```
💬 Message sent to {Officer Name}
Expect a response within 24 hours
```

---

## Status Badge Behavior

### Real-time Updates
All status changes are reflected instantly:
- **Pending** → Orange (#D97706)
- **Acknowledged** → Cyan (#0891B2)
- **In Progress** → Blue (#1A56C4)
- **Under Review** → Blue (#1A56C4)
- **Escalated** → Purple (#7C3AED)
- **Resolved** → Green (#16A34A)

### SLA Badge Updates
- ✅ **OK** (Green) — Within SLA
- ⚠️ **At Risk** (Amber) — <2 days left
- 🔴 **Breach** (Red) — Exceeded SLA

---

## Error Handling

If any action fails, you should see:

```
❌ {Specific error message}
```

Examples:
- "Cannot resolve grievance in pending status"
- "Officer not found"
- "Failed to escalate grievance"

---

## Timeline Verification

After each action, verify the timeline updates:

1. **Acknowledged** — 👁️ icon, cyan background
2. **Assigned** — 👤 icon, blue background
3. **Status Change** — 🔄 icon, purple background
4. **Resolved** — ✅ icon, green background
5. **Escalated** — ⚠️ icon, orange background
6. **Reassigned** — ↔️ icon, gray background
7. **Feedback** — ⭐ icon, yellow background
8. **Note** — 📌 icon, purple background

---

## Data Persistence

All changes persist:
- ✅ Status saved to `data/complaints.json`
- ✅ Timeline entries created and stored
- ✅ Notifications created in `data/notifications.json`
- ✅ Audit log entries in `data/audit-log.json`
- ✅ Refresh page → Data remains updated

---

## Test Checklist

- [ ] Officer can acknowledge unassigned grievance
- [ ] Status badge updates immediately
- [ ] Toast message appears with emoji and details
- [ ] Timeline entry shows within 1 second
- [ ] Citizen receives notification
- [ ] Multiple actions on same grievance work
- [ ] Bulk reassign works for 5+ grievances
- [ ] Citizen feedback with rating displays correctly
- [ ] Escalated grievance shows breach SLA
- [ ] Reopen changes status back to pending
- [ ] All toast messages match expected format
- [ ] Error messages show for invalid actions
- [ ] Data persists after page refresh

---

## Troubleshooting

**Toast not appearing?**
- Check browser console for errors
- Verify `sonner` library is loaded
- Ensure action API call succeeded (check Network tab)

**Status not updating?**
- Clear browser cache
- Refresh the page
- Check `data/complaints.json` was updated

**Notification not received?**
- Check `data/notifications.json` file
- Verify citizenId matches complaint
- Check notification bell icon on page

---

## Implementation Details

### Pages Updated
1. `src/app/portal/complaints/[id]/page.tsx` — Officer detail page
2. `src/app/citizen/grievances/[id]/page.tsx` — Citizen detail page
3. `src/app/portal/escalations/page.tsx` — Escalations management
4. `src/app/portal/reassign/page.tsx` — Bulk reassignment

### Key Features
- ✅ All toasts use emoji for quick visual recognition
- ✅ Error handling with try-catch blocks
- ✅ Status updates reflected immediately in UI
- ✅ Timeline entries created automatically
- ✅ Notifications sent to relevant users
- ✅ Audit logging for all actions

### API Endpoints Used
- `PATCH /api/grievances/[id]` — All grievance actions
- Response includes updated complaint object
- Status field updated based on action type
