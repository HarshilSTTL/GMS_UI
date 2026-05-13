# Complete Grievance System Testing Guide

**Project:** GMS-UI — Swagat 3.0 Health Grievance Management System
**Status:** ✅ Full CRUD Operations Implemented
**Date:** 2026-05-13
**Demo Citizen:** `u_dummy_01` (Demo Citizen)

---

## 🎯 Quick Links

- **File Complaint:** `http://localhost:3000/citizen/file-complaint`
- **View Complaints:** `http://localhost:3000/citizen/complaints`
- **Track Complaint:** `http://localhost:3000/citizen/track`
- **Demo User:** email: `demo.citizen@example.com` | password: `demo123`

---

## 📊 Current System State

### Demo Citizen (u_dummy_01)
```json
{
  "id": "u_dummy_01",
  "name": "Demo Citizen",
  "email": "demo.citizen@example.com",
  "phone": "9123456789",
  "password": "demo123",
  "district": "Ahmedabad",
  "ward": "Ward 12",
  "address": "123 Demo Street, Near Central Station, Ahmedabad"
}
```

### Test Grievances (3 samples)
| ID | Token | Title | Status | Assigned To |
|---|---|---|---|---|
| demo_c1 | DEMO-2026-00001 | Road pothole causing accidents | Open | Unassigned |
| demo_c2 | DEMO-2026-00002 | Street light not working | In Progress | Pooja Desai |
| demo_c3 | DEMO-2026-00003 | Water supply issue fixed | Resolved | Ravi Varma |

---

## 🧪 Test Scenarios

### Test 1: CREATE — File New Complaint
**Objective:** Verify citizen can file a new complaint through web form

**Steps:**
1. Open: `http://localhost:3000/citizen/file-complaint`
2. **Step 1 - Select Category**
   - Click any category (e.g., "Water Supply")
   - Verify selection highlight changes to orange (#FF8C42)
   - Click "Next" or category button again
3. **Step 2 - Enter Details**
   - Description: "Test grievance for verification purposes. The water supply has been disrupted for 2 days."
   - Location: "Ward 12, Ahmedabad"
   - Phone: "+91 91234 56789"
   - Verify character count shows green (>10 chars)
   - Click "Review & Submit"
4. **Step 3 - Confirm**
   - Review all details
   - Click "Submit Complaint"
   - Verify loading spinner appears
5. **Success**
   - See "Complaint Filed Successfully!" message
   - Token displayed (e.g., DEMO-2026-00004)
   - Click "My Complaints" to see it in list

**Expected Result:**
- ✅ New grievance created in `data/complaints.json`
- ✅ Citizen can see it in `/citizen/complaints`
- ✅ Token is unique and trackable
- ✅ Status is "open"

**API Call (Alternative):**
```bash
curl -X POST http://localhost:3000/api/grievances \
  -H "Content-Type: application/json" \
  -d '{
    "citizenId": "u_dummy_01",
    "title": "Road pothole causing accidents — Ward 12",
    "description": "Large pothole on main road causing vehicle damage",
    "category": "Roads & Pavements",
    "department": "Roads & Buildings",
    "location": "Ward 12, Ahmedabad",
    "citizenName": "Demo Citizen",
    "citizenPhone": "+91 91234 56789",
    "citizenEmail": "demo.citizen@example.com",
    "status": "open",
    "priority": "high",
    "channel": "web",
    "ward": "Ward 12",
    "district": "Ahmedabad"
  }'
```

---

### Test 2: READ — List All Citizen Complaints
**Objective:** Verify citizen can see all their grievances

**Steps:**
1. Navigate to: `http://localhost:3000/citizen/complaints`
2. Verify 3+ grievances displayed:
   - ✅ demo_c1 (Road pothole) — Status: Open
   - ✅ demo_c2 (Street light) — Status: In Progress
   - ✅ demo_c3 (Water supply) — Status: Resolved
3. Check color-coded status badges:
   - Open: Gray
   - In Progress: Yellow
   - Resolved: Green
4. Click on "Street light not working" (demo_c2)
5. Verify detail page shows:
   - Full description
   - Assigned officer: Pooja Desai
   - Timeline with all events
   - Action buttons (Add Note, Escalate, etc.)

**Expected Result:**
- ✅ All grievances load
- ✅ Correct status colors
- ✅ Click opens detail page
- ✅ Timeline shows all history

**API Call:**
```bash
curl http://localhost:3000/api/grievances/citizen/u_dummy_01
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "demo_c1",
      "token": "DEMO-2026-00001",
      "title": "Road pothole causing accidents — Demo Ward 12",
      "status": "open",
      "priority": "high",
      "category": "Roads & Pavements",
      "createdAt": "2026-05-13T10:00:00Z",
      "assignedTo": null
    },
    {
      "id": "demo_c2",
      "token": "DEMO-2026-00002",
      "status": "in_progress",
      "assignedTo": {"name": "Pooja Desai"}
    },
    {
      "id": "demo_c3",
      "token": "DEMO-2026-00003",
      "status": "resolved",
      "feedback": "Excellent service!",
      "rating": 5
    }
  ]
}
```

---

### Test 3: READ — Get Single Grievance
**Objective:** Verify detail view shows complete grievance with timeline

**Steps:**
1. From complaints list, click "Street light not working"
2. URL should be: `/citizen/complaints/demo_c2`
3. Verify display:
   - **Header:** Token (DEMO-2026-00002), Status badge
   - **Info:** Category, Department, Priority, Location, Assigned Officer
   - **Timeline:** 3+ events visible
     - "Grievance Filed" (2026-05-12)
     - "Assigned to Pooja Desai"
     - "Work In Progress"
   - **Actions:** Add Note, Escalate, Reopen, etc.
4. Scroll down to see full timeline

**Expected Result:**
- ✅ All grievance details display
- ✅ Timeline shows chronological events
- ✅ Assigned officer visible
- ✅ Action buttons available

**API Call:**
```bash
curl http://localhost:3000/api/grievances/demo_c2
```

---

### Test 4: UPDATE — Add Note to Grievance
**Objective:** Verify citizen can add notes/comments to grievance

**Steps:**
1. On detail page (`/citizen/complaints/demo_c2`), scroll to "Add Note" section
2. Enter text: "Can you provide an update on when the repair will be completed?"
3. Click "Add Note" or "Submit"
4. Verify:
   - Note appears in timeline
   - Timestamp is current
   - Actor shows "Demo Citizen"
5. Check `data/complaints.json` — new timeline entry should exist

**Expected Result:**
- ✅ Note saved to grievance
- ✅ Appears in timeline immediately
- ✅ Persisted to JSON file
- ✅ Shows in detail page reload

**API Call:**
```bash
curl -X PATCH http://localhost:3000/api/grievances/demo_c2 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "add_note",
    "actorId": "u_dummy_01",
    "note": "Can you provide an update on when the repair will be completed?"
  }'
```

---

### Test 5: UPDATE — Escalate Grievance
**Objective:** Verify citizen can escalate unresolved grievance

**Steps:**
1. On detail page (`/citizen/complaints/demo_c2`), click "Escalate" button
2. Enter reason: "No visible action for 3 days. This needs urgent attention."
3. Click "Confirm Escalation"
4. Verify:
   - Status changes to "escalated" (badge color changes)
   - Timeline shows "Grievance Escalated" entry
   - Escalation reason logged
5. Refresh page to confirm persistence

**Expected Result:**
- ✅ Status → "escalated"
- ✅ Timeline entry created
- ✅ Data saved to JSON
- ✅ Persists on page reload

**API Call:**
```bash
curl -X PATCH http://localhost:3000/api/grievances/demo_c2 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "escalate",
    "actorId": "u_dummy_01",
    "escalationReason": "No visible action for 3 days. This needs urgent attention."
  }'
```

---

### Test 6: UPDATE — Leave Feedback on Resolved Grievance
**Objective:** Verify citizen can rate and comment on resolved grievance

**Steps:**
1. Navigate to: `/citizen/complaints/demo_c3` (Water supply — resolved)
2. Scroll to "Leave Feedback" section
3. Select rating: Click 5 stars (★★★★★)
4. Enter comment: "Excellent service! Thank you for fixing the issue so quickly."
5. Click "Submit Feedback"
6. Verify:
   - Feedback appears on detail page
   - Rating displayed (5 stars)
   - Comment visible
   - Timestamp shows

**Expected Result:**
- ✅ Feedback saved
- ✅ Rating stored (1-5)
- ✅ Comment persisted
- ✅ Displays immediately

**API Call:**
```bash
curl -X PATCH http://localhost:3000/api/grievances/demo_c3 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "feedback",
    "actorId": "u_dummy_01",
    "feedbackText": "Excellent service! Thank you for fixing the issue so quickly.",
    "rating": 5
  }'
```

---

### Test 7: UPDATE — Reopen Resolved Grievance
**Objective:** Verify citizen can reopen a resolved grievance if issue persists

**Steps:**
1. On resolved grievance detail (`/citizen/complaints/demo_c3`)
2. Scroll and click "Reopen Grievance" button
3. Enter reason: "Water supply issue has occurred again. Main pipe might need complete replacement."
4. Click "Confirm Reopen"
5. Verify:
   - Status changes back to "open"
   - Timeline shows "Grievance Reopened" entry
   - Badge color changes to gray
   - Grievance now in "open" list

**Expected Result:**
- ✅ Status → "open"
- ✅ Timeline entry added
- ✅ Reopen reason logged
- ✅ Appears in open complaints list

**API Call:**
```bash
curl -X PATCH http://localhost:3000/api/grievances/demo_c3 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reopen",
    "actorId": "u_dummy_01",
    "reopenReason": "Water supply issue has occurred again."
  }'
```

---

### Test 8: DELETE — Remove Grievance
**Objective:** Verify grievance can be deleted (cleanup)

**Steps:**
1. From complaints list, note a grievance ID
2. Delete via API (rarely used in UI):
```bash
curl -X DELETE http://localhost:3000/api/grievances/demo_c1
```
3. Verify:
   - Grievance removed from list
   - No longer appears in `/citizen/complaints`
   - Cannot track by token anymore

**Expected Result:**
- ✅ Grievance deleted
- ✅ Removed from database
- ✅ Not shown in list

---

### Test 9: TRACK — Find Grievance by Token (No Login Required)
**Objective:** Verify anyone can track complaint status using token

**Steps:**
1. Navigate to: `http://localhost:3000/citizen/track`
2. Enter token: `DEMO-2026-00002`
3. Click "Search" or "Track"
4. Verify:
   - Grievance details displayed
   - Full timeline visible
   - No authentication required
   - Status shows current state
   - Assigned officer visible
5. Try another token: `DEMO-2026-00003`
6. Try invalid token: Verify error message

**Expected Result:**
- ✅ Valid tokens show full details
- ✅ No login required
- ✅ Invalid tokens show error
- ✅ All statuses display correctly

**API Call:**
```bash
curl http://localhost:3000/api/grievances/track/DEMO-2026-00002
```

---

## 🎨 Design System Verification

The updated file-complaint page now uses the exact design system colors:

| Element | Color Code | Usage |
|---------|-----------|-------|
| Primary Button (Orange) | #FF8C42 | Active step, category select, submit |
| Success Green | #22C55E | Resolved status, completed step |
| Dark Text | #0F1A2E | Headers, primary text |
| Secondary Text | #7A8FA6 | Labels, hints, secondary info |
| Border Gray | #E5E7EB | Input borders, card borders |
| Page Background | #F4F2EE | Main background |
| Error Red | #FF8A80 | Error messages, required field |
| Card White | #FFFFFF | Form cards, containers |

**Verification Steps:**
1. Open `/citizen/file-complaint`
2. Check button colors — should be #FF8C42 (orange)
3. Check selected category — should have orange border
4. Check step indicator — active step should be orange
5. Check success screen — token box should have orange gradient
6. All text should match the color scheme

---

## 📝 Data Files Verification

### Check User Data
```bash
# Verify demo citizen exists
cat data/users.json | grep -A 10 "u_dummy_01"
```

Expected output should show:
```json
{
  "id": "u_dummy_01",
  "name": "Demo Citizen",
  "email": "demo.citizen@example.com",
  "phone": "9123456789",
  "password": "demo123",
  "role": "citizen"
}
```

### Check Grievance Data
```bash
# Count demo grievances
grep -c "demo_c" data/complaints.json
# Should return: 3
```

### Check Log Files
```bash
# See audit trail
ls -la logs/
# Should show: 2026-05-13.md (or current date)

cat logs/2026-05-13.md
# Should show grievance operations
```

---

## 🔄 Full CRUD Workflow

### Workflow: Create → Update → Resolve → Feedback

1. **CREATE:** File complaint for "Broken bench in park"
   ```bash
   POST /api/grievances
   # Response: { id: "demo_c4", token: "DEMO-2026-00004" }
   ```

2. **READ:** View in complaints list
   ```bash
   GET /api/grievances/citizen/u_dummy_01
   # See new grievance with status: "open"
   ```

3. **UPDATE (Add Note):** Request update
   ```bash
   PATCH /api/grievances/demo_c4
   # action: "add_note", note: "Can you fix this quickly?"
   ```

4. **UPDATE (Escalate):** Escalate if no response
   ```bash
   PATCH /api/grievances/demo_c4
   # action: "escalate", reason: "3 days, no action"
   # Status → "escalated"
   ```

5. **UPDATE (Resolve):** Officer resolves (via admin)
   ```bash
   PATCH /api/grievances/demo_c4
   # action: "resolve", resolution: "Bench replaced"
   # Status → "resolved"
   ```

6. **UPDATE (Feedback):** Citizen rates resolution
   ```bash
   PATCH /api/grievances/demo_c4
   # action: "feedback", rating: 5, feedback: "Great job!"
   ```

7. **READ:** Final state
   ```bash
   GET /api/grievances/demo_c4
   # Complete history with feedback
   ```

---

## ✅ Testing Checklist

### Data Setup
- [ ] Dummy citizen created: `u_dummy_01`
- [ ] 3 test grievances created: `demo_c1`, `demo_c2`, `demo_c3`
- [ ] Users data updated: `data/users.json`
- [ ] Complaints data updated: `data/complaints.json`

### Build & Deployment
- [ ] Build successful: `npm run build`
- [ ] No TypeScript errors
- [ ] Dev server runs: `npm run dev`

### UI/UX Tests
- [ ] File complaint form works (3-step flow)
- [ ] Colors match design system (#FF8C42 orange, #0F1A2E dark, etc.)
- [ ] Step indicator shows progress
- [ ] Category selection highlights correctly
- [ ] Form validation works (character count, phone validation)
- [ ] Success screen displays token
- [ ] Buttons have correct colors and hover states

### CREATE Tests
- [ ] File new complaint via UI
- [ ] Submit creates grievance in database
- [ ] Token is unique and displayable
- [ ] Status set to "open"
- [ ] Timeline shows creation event
- [ ] Grievance appears in citizen list

### READ Tests
- [ ] List all citizen grievances (/citizen/complaints)
- [ ] View single grievance detail (/citizen/complaints/[id])
- [ ] Track by token without login (/citizen/track)
- [ ] API endpoint /api/grievances/citizen/[userId] works
- [ ] API endpoint /api/grievances/[id] works
- [ ] API endpoint /api/grievances/track/[token] works

### UPDATE Tests
- [ ] Add note → appears in timeline
- [ ] Escalate → status changes to "escalated"
- [ ] Leave feedback → rating and text stored
- [ ] Reopen → status back to "open"
- [ ] All changes persist after page reload

### Data Persistence
- [ ] Changes saved to /data/complaints.json
- [ ] Changes saved to /data/users.json
- [ ] Audit log created in /data/audit-log.json
- [ ] Session data in /data/sessions.json
- [ ] Notifications created in /data/notifications.json

---

## 🚀 Running Tests Locally

```bash
# 1. Navigate to project
cd e:\GMS\Local\gms_ui

# 2. Install dependencies (if needed)
npm install

# 3. Build the project
npm run build

# 4. Start dev server
npm run dev

# 5. Open in browser
# http://localhost:3000/citizen/file-complaint
# http://localhost:3000/citizen/complaints
# http://localhost:3000/citizen/track

# 6. Test API endpoints
curl http://localhost:3000/api/grievances/citizen/u_dummy_01
curl http://localhost:3000/api/grievances/demo_c1
curl http://localhost:3000/api/grievances/track/DEMO-2026-00001
```

---

## 📞 Contact & Support

For issues or questions:
1. Check DEMO_CITIZEN_CRUD_GUIDE.md for detailed API documentation
2. Review TASKS.md for project progress
3. Check logs/ directory for operation history
4. Review CLAUDE.md for project architecture

---

## 🎉 Summary

✅ **Full CRUD System Implemented:**
- **CREATE:** File new complaints via 3-step form
- **READ:** List complaints, view details, track by token
- **UPDATE:** Add notes, escalate, provide feedback, reopen
- **DELETE:** Remove grievances (API only)

✅ **Design System Applied:**
- Orange (#FF8C42) for primary actions
- All colors match MEMORY.md specifications
- Responsive layout for all devices

✅ **Data Persistence:**
- All changes saved to JSON files
- Audit trail maintained
- No data loss

✅ **Testing Ready:**
- 3 demo grievances with different statuses
- 1 demo citizen with full permissions
- Complete API documentation
- Step-by-step testing guide

**Status: Ready for Production Testing! 🚀**
