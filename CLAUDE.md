@AGENTS.md

## Task Tracking

All implementation tasks and progress are tracked in `TASKS.md` at project root.
**Always read `TASKS.md` at the start of a session** to understand what's done, what's in progress, and what's pending.
Update `TASKS.md` as tasks are completed or started.

## Logging System

All server-side operations must be logged using the logger utility at `src/lib/logger.ts`.

### How it works
- Log files are stored in `logs/` directory at project root
- Each day gets its own `.md` file (e.g., `logs/2026-05-13.md`)
- `logs/` is in `.gitignore` and never pushed to GitHub

### Usage
```ts
import { log, logAction, logAuth, logData, logError } from '@/lib/logger';

log('INFO', 'Server started');
logAction('Grievance resolved', 'u1', 'cg1');
logAuth('Login success', 'u5');
logData('UPDATE', 'grievances', 'cg1');
logError('File not found', 'grievances.json');
```

### When to log
- Every API write operation (create, update, delete)
- Every auth event (login, register, logout)
- Every grievance action (assign, forward, reassign, transfer, resolve, escalate)
- Errors and exceptions

## Data Architecture

All data is stored as JSON files in the `data/` folder at project root.
No mock data files in `src/data/` — everything uses real JSON file I/O via `src/lib/db.ts`.

### Data Files
- `users.json` — All users (citizens, officers, admins, CM)
- `complaints.json` — All grievances/unified complaint data
- `departments.json` — Department registry
- `officers.json` — Officer data
- `categories.json` — Grievance categories
- `workflows.json` — Workflow definitions
- `workflow.json` — Complaint state machine
- `escalation-rules.json` — Escalation rules
- `notification-templates.json` — Notification templates
- `notifications.json` — Real-time user notifications
- `sla-rules.json` — SLA configurations
- `roles.json` — Role definitions with permissions
- `hierarchy.json` — Organizational hierarchy
- `ai-config.json` — AI feature configuration
- `sessions.json` — Active user sessions (cookie-based)
- `audit-log.json` — Audit trail entries
- `schemes.json` — Government schemes
- `faq.json` — FAQ data

### User Data Separation
- Each citizen's data is linked by their `userId`
- Complaints have `citizenId` field linking to the citizen
- Department officers see complaints assigned to their department
- Cross-user data visibility is maintained through shared complaint data

### API Structure
APIs are designed so database tables can be created directly from JSON structure references.
Each JSON file maps to a potential database table with consistent schema.
