# Demo Citizen CRUD Operations & Testing Guide

## 🎯 Dummy Citizen Account
**Created:** 2026-05-13

| Field | Value |
|-------|-------|
| User ID | `u_dummy_01` |
| Name | Demo Citizen |
| Email | demo.citizen@example.com |
| Phone | 9123456789 |
| Password | demo123 |
| District | Ahmedabad |
| Ward | Ward 12 |
| Address | 123 Demo Street, Near Central Station, Ahmedabad |
| Pincode | 380001 |

---

## 📋 Test Grievances Created

### 1. **Open Grievance** (Status: Open)
- **ID:** demo_c1
- **Token:** DEMO-2026-00001
- **Title:** Road pothole causing accidents — Demo Ward 12
- **Category:** Roads & Pavements
- **Department:** Roads & Buildings
- **Priority:** High
- **SLA Status:** OK (5 days left)
- **Assigned To:** Not assigned yet
- **Timeline:** Just filed

**Test:** File another grievance through web form

---

### 2. **In-Progress Grievance** (Status: In Progress)
- **ID:** demo_c2
- **Token:** DEMO-2026-00002
- **Title:** Street light not working — Demo Ward 12
- **Category:** Street Lighting
- **Department:** AMC
- **Priority:** Medium
- **SLA Status:** OK (4 days left)
- **Assigned To:** Pooja Desai (Roads & Buildings Officer)
- **Timeline:** Filed → Assigned → Work in progress

**Test:** Add a note, request update, escalate grievance

---

### 3. **Resolved Grievance** (Status: Resolved)
- **ID:** demo_c3
- **Token:** DEMO-2026-00003
- **Title:** Water supply issue fixed — Demo Ward 12
- **Category:** Water Supply
- **Department:** GWSSB
- **Priority:** Medium
- **SLA Status:** OK
- **Assigned To:** Ravi Varma (GWSSB Nodal Officer)
- **Timeline:** Filed → Assigned → Resolved
- **Feedback:** 5-star rating with comment

**Test:** Reopen resolved grievance, check feedback display

---

## 🚀 CRUD Operations Testing

### CREATE - File New Complaint
**Endpoint:** `POST /api/grievances`

**Test Steps:**
1. Navigate to: `/citizen/file-complaint`
2. Select category: "Water Supply" or any active category
3. Fill details:
   - Description: "Test grievance for demo citizen"
   - Location: "Ward 12, Ahmedabad"
   - Phone: "+91 91234 56789"
4. Confirm and submit
5. You should receive a token (e.g., DEMO-2026-XXXXX)

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "demo_cX",
    "token": "DEMO-2026-XXXXX",
    "title": "...",
    "status": "open",
    "createdAt": "2026-05-13T..."
  }
}
```

---

### READ - List Citizen Grievances
**Endpoint:** `GET /api/grievances/citizen/u_dummy_01`

**Via API:**
```bash
curl "http://localhost:3000/api/grievances/citizen/u_dummy_01"
```

**Via Web UI:**
1. Navigate to: `/citizen/complaints`
2. All grievances for demo citizen should display

**Expected:** 3 grievances (1 open, 1 in-progress, 1 resolved)

---

### READ - Get Single Grievance
**Endpoint:** `GET /api/grievances/demo_c2`

**Via API:**
```bash
curl "http://localhost:3000/api/grievances/demo_c2"
```

**Via Web UI:**
1. Navigate to: `/citizen/complaints`
2. Click on "Street light not working" grievance
3. See full timeline, assigned officer, status

---

### UPDATE - Add Note to Grievance
**Endpoint:** `PATCH /api/grievances/demo_c2`

**Via API:**
```bash
curl -X PATCH "http://localhost:3000/api/grievances/demo_c2" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "add_note",
    "actorId": "u_dummy_01",
    "note": "Can the officer provide an update on repair timeline?"
  }'
```

**Via Web UI:**
1. Open grievance detail: `/citizen/complaints/demo_c2`
2. Scroll to notes section
3. Add note and submit
4. Note appears in timeline

---

### UPDATE - Escalate Grievance
**Endpoint:** `PATCH /api/grievances/demo_c2`

**Via API:**
```bash
curl -X PATCH "http://localhost:3000/api/grievances/demo_c2" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "escalate",
    "actorId": "u_dummy_01",
    "escalationReason": "No response for 3 days, needs immediate action"
  }'
```

**Via Web UI:**
1. Open grievance detail: `/citizen/complaints/demo_c2`
2. Click "Escalate" button
3. Enter reason
4. Status changes to "escalated" in timeline

---

### UPDATE - Provide Feedback (on resolved grievance)
**Endpoint:** `PATCH /api/grievances/demo_c3`

**Via API:**
```bash
curl -X PATCH "http://localhost:3000/api/grievances/demo_c3" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "feedback",
    "actorId": "u_dummy_01",
    "feedbackText": "Great service! Very satisfied.",
    "rating": 5
  }'
```

**Via Web UI:**
1. Open resolved grievance: `/citizen/complaints/demo_c3`
2. Click "Leave Feedback" button
3. Rate (1-5 stars) and add comment
4. Feedback stored in database

---

### UPDATE - Reopen Resolved Grievance
**Endpoint:** `PATCH /api/grievances/demo_c3`

**Via API:**
```bash
curl -X PATCH "http://localhost:3000/api/grievances/demo_c3" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reopen",
    "actorId": "u_dummy_01",
    "reopenReason": "Issue not fully resolved, water still not coming"
  }'
```

---

### DELETE - Delete Grievance
**Endpoint:** `DELETE /api/grievances/demo_c1`

**Via API:**
```bash
curl -X DELETE "http://localhost:3000/api/grievances/demo_c1"
```

**Note:** Not typically used in production, but available for cleanup

---

## 📱 Track Grievance by Token

**Endpoint:** `GET /api/grievances/track/DEMO-2026-00002`

**Via Web UI:**
1. Navigate to: `/citizen/track`
2. Enter token: `DEMO-2026-00002`
3. Click search
4. See full status and timeline without login

```bash
curl "http://localhost:3000/api/grievances/track/DEMO-2026-00002"
```

---

## 🔍 Testing Checklist

### ✅ Create (C)
- [ ] File complaint through web form (step-by-step)
- [ ] Receive unique token
- [ ] Grievance appears in citizen dashboard
- [ ] Status is "open"
- [ ] Timeline shows "Created" entry

### ✅ Read (R)
- [ ] List all citizen grievances (/citizen/complaints)
- [ ] View single grievance detail (/citizen/complaints/demo_c2)
- [ ] Track by token (/citizen/track)
- [ ] See timeline with all updates

### ✅ Update (U)
- [ ] Add note to grievance → appears in timeline
- [ ] Escalate grievance → status changes to "escalated"
- [ ] Provide feedback on resolved grievance → stored with rating
- [ ] Reopen resolved grievance → status back to "open"
- [ ] See all changes in timeline

### ✅ Delete (D)
- [ ] Delete grievance via API
- [ ] Grievance removed from list

### ✅ Data Persistence
- [ ] All changes saved to `/data/complaints.json`
- [ ] All changes saved to `/data/users.json`
- [ ] Session data in `/data/sessions.json`
- [ ] Audit trail in `/data/audit-log.json`
- [ ] Notifications in `/data/notifications.json`

---

## 🎨 Design System Reference

All pages use the design system colors from MEMORY.md:
- **Brand Orange:** #FF8C42 (primary buttons)
- **Dark Blue:** #0F1A2E (headers, text)
- **Light Gray:** #F4F2EE (page background)
- **Border Gray:** #E5E7EB (input borders)
- **Text Secondary:** #7A8FA6 (helper text)
- **Success Green:** #22C55E (resolved status)
- **Warning Yellow:** #F59E0B (escalated status)
- **Error Red:** #FF8A80 (error states)

---

## 📝 Data Files Updated

1. **`data/users.json`** - Added `u_dummy_01` (Demo Citizen)
2. **`data/complaints.json`** - Added 3 test grievances (demo_c1, demo_c2, demo_c3)

---

## 🔗 Related Files

- **Citizen Auth:** `/api/auth/login`, `/api/auth/otp`, `/api/auth/phone-login`
- **Grievance CRUD:** `/api/grievances`, `/api/grievances/[id]`
- **Citizen Pages:** `/citizen/complaints`, `/citizen/file-complaint`, `/citizen/track`
- **Database:** `src/lib/db.ts` (JSON file I/O)
- **Logging:** `src/lib/logger.ts` (audit trail)

---

## 🚀 Quick Start Commands

```bash
# Build the project
npm run build

# Start development server
npm run dev

# Test citizen login
curl -X POST http://localhost:3000/api/auth/phone-login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9123456789","otp":"123456"}'

# List citizen grievances
curl http://localhost:3000/api/grievances/citizen/u_dummy_01

# Track grievance
curl http://localhost:3000/api/grievances/track/DEMO-2026-00001
```

---

## ✨ Next Steps

1. **File a new complaint** through the web UI to see CREATE in action
2. **Add notes** to in-progress grievance to see UPDATE in action
3. **Escalate** the street light grievance to see status changes
4. **Leave feedback** on the resolved water supply grievance
5. **Track** using token without authentication

All CRUD operations are fully functional and data persists to JSON files!
