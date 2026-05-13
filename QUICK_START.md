# Quick Start Guide — GMS Grievance System

## 🚀 Get Started in 2 Minutes

### 1. Start the Server
```bash
cd e:\GMS\Local\gms_ui
npm run dev
```

Server runs at: `http://localhost:3000`

---

### 2. Test Grievance Filing

**URL:** http://localhost:3000/citizen/file-complaint

**Steps:**
1. Click any category (e.g., "Water Supply")
2. Fill form:
   - Description: "Water supply disrupted"
   - Location: "Ward 12, Ahmedabad"
   - Phone: "+91 91234 56789"
3. Click "Review & Submit"
4. ✅ Get token (e.g., DEMO-2026-00004)

---

### 3. View Submitted Grievances

**URL:** http://localhost:3000/citizen/complaints

**You'll see:**
- ✅ Your newly filed complaint
- ✅ 2 other test grievances (in-progress, resolved)
- Click any to see full details & timeline

---

### 4. Track by Token (No Login)

**URL:** http://localhost:3000/citizen/track

**Steps:**
1. Enter token: `DEMO-2026-00001`
2. Click "Search"
3. ✅ See grievance status & timeline (no login required!)

---

## 👤 Demo Account

| Field | Value |
|-------|-------|
| Name | Demo Citizen |
| Email | demo.citizen@example.com |
| Password | demo123 |
| Phone | 9123456789 |

---

## 🎨 Design System Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Orange** (Primary) | #FF8C42 | Buttons, active states |
| **Dark** (Headers) | #0F1A2E | Text, headers |
| **Gray** (Secondary) | #7A8FA6 | Labels, hints |
| **Border** | #E5E7EB | Inputs, cards |
| **Background** | #F4F2EE | Page background |
| **Green** (Success) | #22C55E | Resolved, completed |
| **Red** (Error) | #FF8A80 | Errors, required |

---

## 📊 Test Grievances Ready

| Token | Title | Status | Assigned To |
|-------|-------|--------|-------------|
| DEMO-2026-00001 | Road pothole | Open | — |
| DEMO-2026-00002 | Street light | In Progress | Pooja Desai |
| DEMO-2026-00003 | Water supply | Resolved | Ravi Varma |

---

## ✨ What You Can Do

### File Complaint
- 3-step form with validation
- Auto-generate unique token
- Save to database

### View Grievances
- List all your complaints
- Click to see full details
- See complete timeline

### Add Notes
- Click "Add Note" on grievance
- Type your message
- Appears in timeline

### Escalate
- Click "Escalate" button
- Enter reason
- Status changes to "escalated"

### Leave Feedback
- On resolved grievance
- Rate 1-5 stars
- Add comment

### Reopen
- Click "Reopen" on resolved grievance
- Enter reason
- Status back to "open"

---

## 📚 Full Documentation

For detailed information:
- **CRUD Guide:** `DEMO_CITIZEN_CRUD_GUIDE.md`
- **Testing Guide:** `DEMO_TESTING_GUIDE.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY.md`

---

## 🔧 API Endpoints (For Testing)

### Create Complaint
```bash
curl -X POST http://localhost:3000/api/grievances \
  -H "Content-Type: application/json" \
  -d '{"citizenId":"u_dummy_01","category":"Water Supply","description":"Test","location":"Ward 12"}'
```

### List Citizen Grievances
```bash
curl http://localhost:3000/api/grievances/citizen/u_dummy_01
```

### Track by Token
```bash
curl http://localhost:3000/api/grievances/track/DEMO-2026-00001
```

### Add Note
```bash
curl -X PATCH http://localhost:3000/api/grievances/demo_c2 \
  -H "Content-Type: application/json" \
  -d '{"action":"add_note","actorId":"u_dummy_01","note":"Status update?"}'
```

---

## ✅ Verification

**Build Status:** ✅ Successful
```bash
npm run build
# No TypeScript errors
# All pages built successfully
```

**Data Files:** ✅ Ready
- data/users.json — Demo citizen added
- data/complaints.json — 3 test grievances
- Ready for full testing!

---

## 🎯 Common Tasks

### File a Complaint
1. Go to `/citizen/file-complaint`
2. Select category
3. Fill details
4. Confirm & submit
5. ✅ Get token

### View My Complaints
1. Go to `/citizen/complaints`
2. See all grievances
3. Click to see details
4. Add notes or escalate

### Track Without Login
1. Go to `/citizen/track`
2. Enter token
3. See status & timeline
4. No authentication needed!

---

## 📞 Need Help?

Check documentation files in order:
1. **QUICK_START.md** ← You are here
2. **DEMO_TESTING_GUIDE.md** — Step-by-step tests
3. **DEMO_CITIZEN_CRUD_GUIDE.md** — API details
4. **IMPLEMENTATION_SUMMARY.md** — Full overview

---

## 🚀 Ready?

```bash
npm run dev
# Visit http://localhost:3000/citizen/file-complaint
```

**Start filing complaints now!** 🎉
