// Phase 3 — Admin Data: roles, users, departments, hierarchy, SLA rules, workflow, audit
window.GMS = window.GMS || {};

/* ── ADMIN ROLES ──────────────────────────────────── */
window.GMS.ADMIN_ROLES = [
  {
    id: 'SUPER', name: 'Super Admin', nameGu: 'સુપર એડમિન',
    scope: 'state', scopeName: 'Government of Gujarat',
    avatar: 'SK', personName: 'Smt. Sonal Kanani', personTitle: 'IAS, Secretary (Reforms)',
    perms: ['ALL'],
    color: '#7C3AED'
  },
  {
    id: 'DEPT', name: 'Department Admin', nameGu: 'વિભાગ એડમિન',
    scope: 'department', scopeName: 'Health & FW Department',
    avatar: 'AP', personName: 'Dr. Anand Patel', personTitle: 'Director, HFWD',
    perms: ['users.view', 'users.edit', 'roles.view', 'sla.edit', 'workflow.edit', 'notif.edit', 'audit.view', 'cat.edit'],
    color: '#DC2626'
  },
  {
    id: 'DIST', name: 'District Admin', nameGu: 'જિલ્લા એડમિન',
    scope: 'district', scopeName: 'Ahmedabad District',
    avatar: 'PS', personName: 'Smt. Priya Sharma', personTitle: 'IAS, Collector',
    perms: ['users.view', 'users.edit-district', 'sla.view', 'workflow.view', 'audit.view'],
    color: '#0EA5E9'
  },
];

/* ── DEPARTMENTS ──────────────────────────────────── */
window.GMS.DEPARTMENTS = [
  { code: 'HFWD', name: 'Health & Family Welfare', nameGu: 'આરોગ્ય', icon: '', iconName: 'hospital', color: '#DC2626', staff: 4280, offices: 26 },
  { code: 'WSSD', name: 'Water Supply & Sanitation', nameGu: 'પાણી પુરવઠો', icon: '', iconName: 'drop', color: '#0EA5E9', staff: 1840, offices: 18 },
  { code: 'RBD', name: 'Roads & Buildings', nameGu: 'માર્ગ-મકાન', icon: '', iconName: 'road', color: '#F59E0B', staff: 2150, offices: 22 },
  { code: 'UDD', name: 'Urban Development', nameGu: 'શહેરી વિકાસ', icon: '', iconName: 'building', color: '#7C3AED', staff: 980, offices: 14 },
  { code: 'AGRI', name: 'Agriculture & Co-operation', nameGu: 'કૃષિ', icon: '', iconName: 'leaf', color: '#16A34A', staff: 1620, offices: 31 },
  { code: 'EDU', name: 'Education', nameGu: 'શિક્ષણ', icon: '', iconName: 'document', color: '#0891B2', staff: 6840, offices: 33 },
  { code: 'POLICE', name: 'Home (Police)', nameGu: 'ગૃહ (પોલીસ)', icon: '', iconName: 'shield', color: '#0F1A2E', staff: 8200, offices: 33 },
  { code: 'REV', name: 'Revenue', nameGu: 'મહેસૂલ', icon: '', iconName: 'log', color: '#92400E', staff: 1450, offices: 33 },
];

/* ── HIERARCHY (from sample, expanded) ─────────────── */
window.GMS.HIERARCHY = {
  id: 'GOG', name: 'Government of Gujarat', type: 'STATE', emp: 28560, expanded: true, children: [
    { id: 'CMO', name: 'Office of Hon. Chief Minister', type: 'OFFICE', emp: 86, expanded: false, children: [] },
    { id: 'CSO', name: 'Office of Chief Secretary', type: 'OFFICE', emp: 124, expanded: true, children: [
      { id: 'D-AGRI', name: 'Agriculture & Co-operation', type: 'DEPT', deptCode: 'AGRI', emp: 1620, expanded: true, children: [
        { id: 'HO-AGRI', name: 'Directorate of Agriculture', type: 'HEAD_OFFICE', emp: 320, expanded: true, children: [
          { id: 'O-AGRI-GNR', name: 'Office of Dy. Director (Extension), Gandhinagar', type: 'OFFICE', emp: 48, expanded: false, children: [
            { id: 'B-AGRI-SEED', name: 'Asst. Director Of Agri (SEED)', type: 'BRANCH', emp: 12, expanded: false, children: [
              { id: 'P-JCLERK', name: 'Junior Clerk', type: 'POST', emp: 4, expanded: false, children: [
                { id: 'E-RAMESH', name: 'Mr. RAMESHKUMAR CHAUDHARY', designation: 'Junior Clerk', type: 'EMPLOYEE', children: [] },
                { id: 'E-VIJAY', name: 'Mr. VIJAYBHAI PATEL', designation: 'Junior Clerk', type: 'EMPLOYEE', children: [] },
              ] },
            ] },
            { id: 'O-AGRI-AHM', name: 'Office of Dy. Director, Ahmedabad', type: 'OFFICE', emp: 38, expanded: false, children: [] },
          ] },
        ] },
      ] },
      { id: 'D-HFWD', name: 'Health & Family Welfare', type: 'DEPT', deptCode: 'HFWD', emp: 4280, expanded: true, children: [
        { id: 'HO-HFWD', name: 'Commissionerate of Health', type: 'HEAD_OFFICE', emp: 280, expanded: true, children: [
          { id: 'O-HFWD-AHM', name: 'CDHO Office Ahmedabad', type: 'OFFICE', emp: 72, expanded: true, children: [
            { id: 'B-CDHO-DIS', name: 'District Surveillance Unit', type: 'BRANCH', emp: 14, expanded: false, children: [
              { id: 'P-CDHO-MO', name: 'Medical Officer', type: 'POST', emp: 5, expanded: false, children: [
                { id: 'E-SURESH', name: 'Dr. Suresh Mehta', designation: 'CDHO', type: 'EMPLOYEE', children: [] },
              ] },
            ] },
            { id: 'B-CDHO-IMM', name: 'Immunization Cell', type: 'BRANCH', emp: 9, expanded: false, children: [] },
          ] },
          { id: 'O-HFWD-SUR', name: 'CDHO Office Surat', type: 'OFFICE', emp: 64, expanded: false, children: [] },
          { id: 'O-HFWD-VAD', name: 'CDHO Office Vadodara', type: 'OFFICE', emp: 58, expanded: false, children: [] },
        ] },
      ] },
      { id: 'D-WSSD', name: 'Water Supply & Sanitation', type: 'DEPT', deptCode: 'WSSD', emp: 1840, expanded: false, children: [] },
      { id: 'D-RBD', name: 'Roads & Buildings', type: 'DEPT', deptCode: 'RBD', emp: 2150, expanded: false, children: [] },
      { id: 'D-UDD', name: 'Urban Development', type: 'DEPT', deptCode: 'UDD', emp: 980, expanded: false, children: [] },
      { id: 'D-EDU', name: 'Education', type: 'DEPT', deptCode: 'EDU', emp: 6840, expanded: false, children: [] },
      { id: 'D-POLICE', name: 'Home Department', type: 'DEPT', deptCode: 'POLICE', emp: 8200, expanded: false, children: [] },
      { id: 'D-REV', name: 'Revenue', type: 'DEPT', deptCode: 'REV', emp: 1450, expanded: false, children: [] },
    ] },
  ]
};

window.GMS.HIER_TYPE_META = {
  STATE: { iconName: 'building', label: 'State', color: '#0F1A2E' },
  OFFICE: { iconName: 'building', label: 'Office', color: '#1A3260' },
  DEPT: { iconName: 'briefcase', label: 'Department', color: '#7C3AED' },
  HEAD_OFFICE: { iconName: 'building', label: 'Head Office', color: '#0EA5E9' },
  BRANCH: { iconName: 'leaf', label: 'Branch', color: '#16A34A' },
  POST: { iconName: 'award', label: 'Post', color: '#F59E0B' },
  EMPLOYEE: { iconName: 'user', label: 'Employee', color: '#DB2777' },
};

/* ── USERS (50 sample) ────────────────────────────── */
const FN = ['Anand', 'Priya', 'Suresh', 'Kavita', 'Rajesh', 'Meena', 'Vikram', 'Asha', 'Manoj', 'Sangita', 'Hiren', 'Bhavna', 'Dipak', 'Rekha', 'Ashok', 'Jyoti', 'Nilesh', 'Pooja', 'Sanjay', 'Nita', 'Ramesh', 'Vandana', 'Yogesh', 'Kiran', 'Naresh'];
const LN = ['Patel', 'Shah', 'Mehta', 'Joshi', 'Sharma', 'Desai', 'Trivedi', 'Soni', 'Modi', 'Pandya', 'Vyas', 'Bhatt', 'Parmar', 'Solanki', 'Chaudhary', 'Suthar'];
const TITLES = ['Junior Clerk', 'Senior Clerk', 'Section Officer', 'Deputy Director', 'Director', 'Joint Secretary', 'Secretary', 'Medical Officer', 'CDHO', 'BHO', 'Sub-Engineer', 'Executive Engineer', 'Tehsildar', 'Mamlatdar', 'Talati'];
const DISTRICTS = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Kheda', 'Mehsana'];

window.GMS.USERS = (function() {
  const arr = [];
  let id = 1001;
  for (let i = 0; i < 50; i++) {
    const f = FN[i % FN.length], l = LN[(i * 3) % LN.length];
    const dept = window.GMS.DEPARTMENTS[i % 8];
    const title = TITLES[i % TITLES.length];
    const dist = DISTRICTS[i % 10];
    const isAdmin = i < 6;
    arr.push({
      id: 'U-' + (id++),
      name: `${i % 3 === 0 ? 'Smt.' : 'Shri'} ${f} ${l}`,
      email: `${f.toLowerCase()}.${l.toLowerCase()}@gujarat.gov.in`,
      phone: '+91 9' + (800000000 + i * 17389),
      role: isAdmin ? (i === 0 ? 'SUPER' : i < 3 ? 'DEPT' : 'DIST') : 'OFFICER',
      roleLabel: isAdmin ? (i === 0 ? 'Super Admin' : i < 3 ? 'Department Admin' : 'District Admin') : title,
      dept: dept.code,
      district: dist,
      designation: title,
      status: i === 7 || i === 23 ? 'INACTIVE' : i === 14 ? 'SUSPENDED' : 'ACTIVE',
      lastLogin: i % 3 === 0 ? '2 hours ago' : i % 3 === 1 ? '1 day ago' : `${i % 8 + 1} days ago`,
      created: `2024-${(i % 12 + 1).toString().padStart(2,'0')}-${(i % 28 + 1).toString().padStart(2,'0')}`,
      avatar: f[0] + l[0],
    });
  }
  return arr;
})();

/* ── PERMISSIONS MATRIX ──────────────────────────── */
window.GMS.PERMISSIONS = [
  { module: 'Dashboard', code: 'dashboard', iconName: 'dashboard' },
  { module: 'User Management', code: 'users', iconName: 'users' },
  { module: 'Roles & Permissions', code: 'roles', iconName: 'shield' },
  { module: 'Hierarchy', code: 'hierarchy', iconName: 'tree' },
  { module: 'Categories', code: 'categories', iconName: 'tag' },
  { module: 'SLA Rules', code: 'sla', iconName: 'clock' },
  { module: 'Workflow', code: 'workflow', iconName: 'workflow' },
  { module: 'Notifications', code: 'notif', iconName: 'bell' },
  { module: 'AI Config', code: 'ai', iconName: 'bot' },
  { module: 'Master Data', code: 'master', iconName: 'folder' },
  { module: 'Audit Logs', code: 'audit', iconName: 'log' },
];

window.GMS.PERMISSION_LEVELS = ['view', 'edit', 'approve', 'delete'];

window.GMS.ROLE_PERMS = {
  SUPER: Object.fromEntries(window.GMS.PERMISSIONS.map(p => [p.code, ['view','edit','approve','delete']])),
  DEPT: { dashboard: ['view'], users: ['view','edit'], roles: ['view'], hierarchy: ['view','edit'], categories: ['view','edit','approve'], sla: ['view','edit'], workflow: ['view','edit'], notif: ['view','edit'], ai: ['view'], master: ['view'], audit: ['view'] },
  DIST: { dashboard: ['view'], users: ['view'], roles: [], hierarchy: ['view'], categories: ['view'], sla: ['view'], workflow: ['view'], notif: [], ai: [], master: ['view'], audit: ['view'] },
  OFFICER: { dashboard: ['view'], users: [], roles: [], hierarchy: ['view'], categories: ['view'], sla: ['view'], workflow: ['view'], notif: [], ai: [], master: [], audit: [] },
};

/* ── CATEGORIES (from Phase 1 + extended) ─────────── */
window.GMS.CATEGORIES = [
  { code: 'HFW-FAC-CLN', name: 'Hospital Cleanliness', dept: 'HFWD', sla: 48, priority: 'HIGH', subs: 4, fields: ['photo', 'location', 'patient_id'] },
  { code: 'HFW-PMJAY', name: 'PMJAY Card Issue', dept: 'HFWD', sla: 72, priority: 'HIGH', subs: 6, fields: ['aadhaar', 'card_id'] },
  { code: 'HFW-DRUG', name: 'Drug Shortage', dept: 'HFWD', sla: 24, priority: 'CRITICAL', subs: 3, fields: ['hospital', 'drug_name'] },
  { code: 'WSS-LEAK', name: 'Pipeline Leakage', dept: 'WSSD', sla: 24, priority: 'HIGH', subs: 5, fields: ['photo', 'location'] },
  { code: 'WSS-QUAL', name: 'Water Quality', dept: 'WSSD', sla: 48, priority: 'CRITICAL', subs: 4, fields: ['photo', 'lab_report'] },
  { code: 'WSS-SUPPLY', name: 'No Supply', dept: 'WSSD', sla: 24, priority: 'HIGH', subs: 3, fields: ['location', 'days'] },
  { code: 'RBD-POTHOLE', name: 'Potholes', dept: 'RBD', sla: 168, priority: 'MEDIUM', subs: 2, fields: ['photo', 'gps'] },
  { code: 'RBD-LIGHT', name: 'Street Light', dept: 'RBD', sla: 72, priority: 'MEDIUM', subs: 2, fields: ['gps', 'pole_id'] },
  { code: 'UDD-DRAIN', name: 'Drainage Choked', dept: 'UDD', sla: 48, priority: 'HIGH', subs: 3, fields: ['photo', 'location'] },
  { code: 'UDD-WASTE', name: 'Garbage Collection', dept: 'UDD', sla: 24, priority: 'MEDIUM', subs: 2, fields: ['photo', 'location'] },
  { code: 'AGR-PMKISAN', name: 'PM-KISAN Issue', dept: 'AGRI', sla: 168, priority: 'MEDIUM', subs: 4, fields: ['aadhaar', 'land_record'] },
  { code: 'AGR-CROP', name: 'Crop Damage Claim', dept: 'AGRI', sla: 240, priority: 'HIGH', subs: 5, fields: ['photo', 'survey_no', 'claim'] },
  { code: 'EDU-FEE', name: 'Fee Refund', dept: 'EDU', sla: 240, priority: 'LOW', subs: 2, fields: ['receipt', 'school_id'] },
  { code: 'POL-FIR', name: 'FIR Status', dept: 'POLICE', sla: 96, priority: 'HIGH', subs: 1, fields: ['fir_no'] },
  { code: 'REV-LAND', name: 'Land Records', dept: 'REV', sla: 240, priority: 'MEDIUM', subs: 3, fields: ['survey_no'] },
];

/* ── SLA RULES (25 rules) ─────────────────────────── */
window.GMS.SLA_RULES = [
  { id: 'SLA-001', name: 'Critical Health — Drug Shortage', priority: 1, active: true, conditions: [['category','equals','HFW-DRUG']], slaHours: 24, escalations: [{lvl:1,after:12,role:'BHO'},{lvl:2,after:18,role:'CDHO'},{lvl:3,after:24,role:'Director Health'}], priorityOut: 'CRITICAL', dept: 'HFWD' },
  { id: 'SLA-002', name: 'Hospital Cleanliness — Urban', priority: 2, active: true, conditions: [['category','equals','HFW-FAC-CLN'],['locationType','equals','URBAN']], slaHours: 48, escalations: [{lvl:1,after:24,role:'BHO'},{lvl:2,after:36,role:'CDHO'}], priorityOut: 'HIGH', dept: 'HFWD' },
  { id: 'SLA-003', name: 'Hospital Cleanliness — Rural', priority: 3, active: true, conditions: [['category','equals','HFW-FAC-CLN'],['locationType','equals','RURAL']], slaHours: 72, escalations: [{lvl:1,after:36,role:'BHO'},{lvl:2,after:60,role:'CDHO'}], priorityOut: 'HIGH', dept: 'HFWD' },
  { id: 'SLA-004', name: 'PMJAY Card — All', priority: 4, active: true, conditions: [['category','equals','HFW-PMJAY']], slaHours: 72, escalations: [{lvl:1,after:48,role:'District Coordinator'},{lvl:2,after:72,role:'State PMJAY'}], priorityOut: 'HIGH', dept: 'HFWD' },
  { id: 'SLA-005', name: 'Water Supply — Critical Quality', priority: 1, active: true, conditions: [['category','equals','WSS-QUAL']], slaHours: 48, escalations: [{lvl:1,after:18,role:'AE Water'},{lvl:2,after:30,role:'EE Water'},{lvl:3,after:42,role:'Chief Engineer'}], priorityOut: 'CRITICAL', dept: 'WSSD' },
  { id: 'SLA-006', name: 'Pipeline Leak — Urban', priority: 5, active: true, conditions: [['category','equals','WSS-LEAK'],['locationType','equals','URBAN']], slaHours: 24, escalations: [{lvl:1,after:12,role:'AE Water'},{lvl:2,after:18,role:'EE Water'}], priorityOut: 'HIGH', dept: 'WSSD' },
  { id: 'SLA-007', name: 'No Water Supply', priority: 6, active: true, conditions: [['category','equals','WSS-SUPPLY']], slaHours: 24, escalations: [{lvl:1,after:12,role:'AE Water'}], priorityOut: 'HIGH', dept: 'WSSD' },
  { id: 'SLA-008', name: 'Potholes — Urban', priority: 7, active: true, conditions: [['category','equals','RBD-POTHOLE'],['locationType','equals','URBAN']], slaHours: 168, escalations: [{lvl:1,after:120,role:'AE Roads'}], priorityOut: 'MEDIUM', dept: 'RBD' },
  { id: 'SLA-009', name: 'Potholes — Highway', priority: 8, active: true, conditions: [['category','equals','RBD-POTHOLE'],['roadType','equals','HIGHWAY']], slaHours: 96, escalations: [{lvl:1,after:48,role:'AE Highway'},{lvl:2,after:72,role:'EE Highway'}], priorityOut: 'HIGH', dept: 'RBD' },
  { id: 'SLA-010', name: 'Street Light Out', priority: 9, active: true, conditions: [['category','equals','RBD-LIGHT']], slaHours: 72, escalations: [{lvl:1,after:48,role:'JE Electrical'}], priorityOut: 'MEDIUM', dept: 'RBD' },
  { id: 'SLA-011', name: 'Drainage — Monsoon Window', priority: 10, active: true, conditions: [['category','equals','UDD-DRAIN'],['season','equals','MONSOON']], slaHours: 24, escalations: [{lvl:1,after:12,role:'JE Drainage'},{lvl:2,after:18,role:'AE Civil'}], priorityOut: 'CRITICAL', dept: 'UDD' },
  { id: 'SLA-012', name: 'Drainage — Off-season', priority: 11, active: true, conditions: [['category','equals','UDD-DRAIN'],['season','equals','OFF-SEASON']], slaHours: 72, escalations: [{lvl:1,after:48,role:'JE Drainage'}], priorityOut: 'MEDIUM', dept: 'UDD' },
  { id: 'SLA-013', name: 'Garbage Collection', priority: 12, active: true, conditions: [['category','equals','UDD-WASTE']], slaHours: 24, escalations: [{lvl:1,after:18,role:'Sanitary Inspector'}], priorityOut: 'MEDIUM', dept: 'UDD' },
  { id: 'SLA-014', name: 'PM-KISAN Issue', priority: 13, active: true, conditions: [['category','equals','AGR-PMKISAN']], slaHours: 168, escalations: [{lvl:1,after:120,role:'Mamlatdar'},{lvl:2,after:144,role:'Collector'}], priorityOut: 'MEDIUM', dept: 'AGRI' },
  { id: 'SLA-015', name: 'Crop Damage — High Loss (>50%)', priority: 14, active: true, conditions: [['category','equals','AGR-CROP'],['lossPct','gt',50]], slaHours: 168, escalations: [{lvl:1,after:96,role:'Tehsildar'},{lvl:2,after:144,role:'Collector'}], priorityOut: 'HIGH', dept: 'AGRI' },
  { id: 'SLA-016', name: 'Crop Damage — Standard', priority: 15, active: true, conditions: [['category','equals','AGR-CROP']], slaHours: 240, escalations: [{lvl:1,after:168,role:'Tehsildar'}], priorityOut: 'MEDIUM', dept: 'AGRI' },
  { id: 'SLA-017', name: 'Education Fee Refund', priority: 16, active: true, conditions: [['category','equals','EDU-FEE']], slaHours: 240, escalations: [{lvl:1,after:168,role:'BEO'}], priorityOut: 'LOW', dept: 'EDU' },
  { id: 'SLA-018', name: 'FIR Status — General', priority: 17, active: true, conditions: [['category','equals','POL-FIR']], slaHours: 96, escalations: [{lvl:1,after:48,role:'PI'},{lvl:2,after:72,role:'DSP'}], priorityOut: 'HIGH', dept: 'POLICE' },
  { id: 'SLA-019', name: 'Land Records — General', priority: 18, active: true, conditions: [['category','equals','REV-LAND']], slaHours: 240, escalations: [{lvl:1,after:168,role:'Talati'},{lvl:2,after:216,role:'Mamlatdar'}], priorityOut: 'MEDIUM', dept: 'REV' },
  { id: 'SLA-020', name: 'Senior Citizen Override', priority: 0, active: true, conditions: [['citizenType','equals','SENIOR']], slaHours: -50, escalations: [], priorityOut: 'HIGH', dept: 'ALL', isOverride: true, note: 'Reduces SLA by 50% for any category' },
  { id: 'SLA-021', name: 'Disability Override', priority: 0, active: true, conditions: [['citizenType','equals','PWD']], slaHours: -50, escalations: [], priorityOut: 'HIGH', dept: 'ALL', isOverride: true, note: 'Reduces SLA by 50%' },
  { id: 'SLA-022', name: 'Tribal Area Boost', priority: 19, active: false, conditions: [['areaType','equals','TRIBAL']], slaHours: -25, escalations: [], priorityOut: 'HIGH', dept: 'ALL', isOverride: true, note: 'Draft — pending approval' },
  { id: 'SLA-023', name: 'Festival Window — Civic', priority: 20, active: true, conditions: [['period','equals','FESTIVAL']], slaHours: 12, escalations: [{lvl:1,after:6,role:'Ward Officer'}], priorityOut: 'HIGH', dept: 'UDD' },
  { id: 'SLA-024', name: 'Default Rule (catchall)', priority: 99, active: true, conditions: [['category','any']], slaHours: 240, escalations: [{lvl:1,after:168,role:'District Officer'}], priorityOut: 'MEDIUM', dept: 'ALL' },
  { id: 'SLA-025', name: 'CMO Reference', priority: 0, active: true, conditions: [['source','equals','CMO']], slaHours: 24, escalations: [{lvl:1,after:12,role:'Secretary'}], priorityOut: 'CRITICAL', dept: 'ALL' },
];

/* ── WORKFLOW STATES ──────────────────────────────── */
window.GMS.WF_STATES = [
  { id: 'NEW', label: 'New', color: '#0EA5E9', initial: true, x: 80, y: 100 },
  { id: 'TRIAGED', label: 'Triaged', color: '#7C3AED', x: 240, y: 100 },
  { id: 'ASSIGNED', label: 'Assigned', color: '#1A3260', x: 400, y: 100 },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#F59E0B', x: 560, y: 100 },
  { id: 'INFO_REQ', label: 'Info Requested', color: '#0891B2', x: 560, y: 220 },
  { id: 'ESCALATED', label: 'Escalated', color: '#DC2626', x: 720, y: 220 },
  { id: 'RESOLVED', label: 'Resolved', color: '#16A34A', x: 720, y: 100 },
  { id: 'CLOSED', label: 'Closed', color: '#6B7280', terminal: true, x: 880, y: 100 },
  { id: 'REOPENED', label: 'Re-opened', color: '#DB2777', x: 880, y: 220 },
];

window.GMS.WF_TRANSITIONS = [
  { from: 'NEW', to: 'TRIAGED', action: 'AI auto-classify' },
  { from: 'TRIAGED', to: 'ASSIGNED', action: 'Assign to officer' },
  { from: 'ASSIGNED', to: 'IN_PROGRESS', action: 'Officer accepts' },
  { from: 'IN_PROGRESS', to: 'INFO_REQ', action: 'Need more info' },
  { from: 'INFO_REQ', to: 'IN_PROGRESS', action: 'Citizen replies' },
  { from: 'IN_PROGRESS', to: 'ESCALATED', action: 'SLA breach / manual' },
  { from: 'ESCALATED', to: 'IN_PROGRESS', action: 'Action taken' },
  { from: 'IN_PROGRESS', to: 'RESOLVED', action: 'Officer resolves' },
  { from: 'RESOLVED', to: 'CLOSED', action: 'Auto-close after 24h' },
  { from: 'CLOSED', to: 'REOPENED', action: 'Citizen requests' },
  { from: 'REOPENED', to: 'IN_PROGRESS', action: 'Re-assigned' },
];

window.GMS.WF_ACTIONS_BY_STATE = {
  NEW: ['View', 'Triage'],
  TRIAGED: ['View', 'Assign', 'Re-classify'],
  ASSIGNED: ['View', 'Accept', 'Reassign', 'Forward'],
  IN_PROGRESS: ['Resolve', 'Escalate', 'Request Info', 'Add Note'],
  INFO_REQ: ['View', 'Re-message Citizen', 'Cancel Request'],
  ESCALATED: ['View', 'Assign Higher', 'Resolve'],
  RESOLVED: ['View', 'Close', 'Reopen'],
  CLOSED: ['View', 'Reopen'],
  REOPENED: ['Assign', 'Resolve'],
};

/* ── NOTIFICATION TEMPLATES ───────────────────────── */
window.GMS.NOTIF_TEMPLATES = [
  { id: 'NT-001', trigger: 'GRIEVANCE_FILED', channels: ['SMS', 'WHATSAPP', 'EMAIL'], lang: 'en', body: 'Dear {citizen_name}, your grievance {ticket_id} has been registered. Track at swagat.gujarat.gov.in/{ticket_id}. SLA: {sla_days} days.', enabled: true },
  { id: 'NT-002', trigger: 'GRIEVANCE_FILED', channels: ['SMS', 'WHATSAPP'], lang: 'gu', body: 'નમસ્કાર {citizen_name}, તમારી ફરિયાદ {ticket_id} નોંધાઈ ગઈ છે. SLA: {sla_days} દિવસ.', enabled: true },
  { id: 'NT-003', trigger: 'ASSIGNED', channels: ['SMS'], lang: 'en', body: 'Hi {citizen_name}, your grievance {ticket_id} is assigned to {officer_name}. Expected resolution: {due_date}.', enabled: true },
  { id: 'NT-004', trigger: 'INFO_REQUESTED', channels: ['SMS', 'WHATSAPP'], lang: 'en', body: 'Action needed: We need additional info on grievance {ticket_id}. Reply on the portal or call 1800-XXX-XXXX.', enabled: true },
  { id: 'NT-005', trigger: 'ESCALATED', channels: ['SMS', 'EMAIL'], lang: 'en', body: 'Your grievance {ticket_id} has been escalated to higher authorities to ensure faster resolution.', enabled: true },
  { id: 'NT-006', trigger: 'RESOLVED', channels: ['SMS', 'WHATSAPP', 'EMAIL'], lang: 'en', body: 'Good news! Your grievance {ticket_id} has been resolved. Please rate your experience: {feedback_link}', enabled: true },
  { id: 'NT-007', trigger: 'SLA_BREACH', channels: ['EMAIL'], lang: 'en', body: '[Internal] Grievance {ticket_id} has breached SLA. Officer: {officer_name}, Hours over: {hours_over}.', enabled: true, internal: true },
  { id: 'NT-008', trigger: 'OFFICER_ASSIGNED', channels: ['EMAIL', 'SMS'], lang: 'en', body: '[Internal] New grievance {ticket_id} assigned. Priority: {priority}, SLA: {sla}h. Open: {portal_link}', enabled: true, internal: true },
];

window.GMS.NOTIF_TRIGGERS = [
  { code: 'GRIEVANCE_FILED', label: 'Grievance Filed', iconName: 'edit', color: '#0EA5E9' },
  { code: 'ASSIGNED', label: 'Assigned to Officer', iconName: 'user', color: '#1A3260' },
  { code: 'INFO_REQUESTED', label: 'Info Requested', iconName: 'info', color: '#F59E0B' },
  { code: 'ESCALATED', label: 'Escalated', iconName: 'arrowUp', color: '#DC2626' },
  { code: 'RESOLVED', label: 'Resolved', iconName: 'check', color: '#16A34A' },
  { code: 'CLOSED', label: 'Closed', iconName: 'lock', color: '#6B7280' },
  { code: 'SLA_BREACH', label: 'SLA Breach (internal)', iconName: 'alert', color: '#DC2626' },
  { code: 'OFFICER_ASSIGNED', label: 'Officer Notification', iconName: 'inbox', color: '#7C3AED' },
];

/* ── SCHEMES & SERVICES ────────────────────────────────── */
window.GMS.SCHEMES = [
  { id: 'PMJAY', name: 'PM-JAY (Ayushman Bharat)', description: 'Free healthcare coverage up to ₹5 lakh', domain: 'HEALTH', budget: 6000000000, beneficiaries: 45000000, eligibility: [{ title: 'Income Category', value: 'BPL/APL/EWS' }, { title: 'Annual Income', value: '< ₹5 lakh' }, { title: 'Age', value: '18-60 years' }] },
  { id: 'JSY', name: 'Janani Suraksha Yojana', description: 'Safe motherhood & institutional delivery support', domain: 'HEALTH', budget: 1200000000, beneficiaries: 8000000, eligibility: [{ title: 'Gender', value: 'Female' }, { title: 'Life Stage', value: 'Pregnant women' }, { title: 'Location', value: 'Rural/Urban' }] },
  { id: 'PMFBY', name: 'PM Fasal Bima Yojana', description: 'Crop insurance for farmers', domain: 'AGRI', budget: 9000000000, beneficiaries: 5600000, eligibility: [{ title: 'Occupation', value: 'Registered farmer' }, { title: 'Land Ownership', value: 'Proof required' }, { title: 'Social Category', value: 'SC/ST/OBC/General' }] },
  { id: 'PM_KISAN', name: 'PM Kisan Samman Nidhi', description: '₹6000/year direct support to farmers', domain: 'AGRI', budget: 8400000000, beneficiaries: 11000000, eligibility: [{ title: 'Occupation', value: 'Farmer/Agricultural worker' }, { title: 'Age', value: '> 18 years' }, { title: 'Income Limit', value: '₹1.5 lakh/year' }] },
  { id: 'JJM', name: 'Jal Jeevan Mission', description: 'Drinking water access to all households', domain: 'WATER', budget: 15000000000, beneficiaries: 190000000, eligibility: [{ title: 'Location', value: 'Rural areas' }, { title: 'Current Status', value: 'No piped water access' }, { title: 'Participation', value: 'Community involvement required' }] },
  { id: 'PMGSY', name: 'PM Gram Sadak Yojana', description: 'Road connectivity to villages', domain: 'ROADS', budget: 12000000000, beneficiaries: 300000000, eligibility: [{ title: 'Location', value: 'Village with population > 500' }, { title: 'Road Status', value: 'No existing all-weather road' }, { title: 'Approval', value: 'Gram panchayat endorsement' }] },
  { id: 'AMRUT', name: 'AMRUT Scheme', description: 'Urban water supply & sanitation', domain: 'URBAN', budget: 5000000000, beneficiaries: 100000000, eligibility: [{ title: 'Location', value: 'Urban areas' }, { title: 'Population', value: '1-10 lakh' }, { title: 'Category', value: 'Non-GIS cities' }] },
  { id: 'SBM', name: 'Swachh Bharat Mission', description: 'Open defecation elimination & sanitation', domain: 'URBAN', budget: 8000000000, beneficiaries: 500000000, eligibility: [{ title: 'Location', value: 'Rural/Urban' }, { title: 'Priority', value: 'BPL households' }, { title: 'Current Status', value: 'No toilet access' }] },
  { id: 'PMAY_U', name: 'PM Awas Yojana (Urban)', description: 'Affordable housing for economically weaker sections', domain: 'URBAN', budget: 7500000000, beneficiaries: 1000000, eligibility: [{ title: 'Income Category', value: 'EWS/LIG' }, { title: 'Annual Income', value: '< ₹6 lakh' }, { title: 'Housing Status', value: 'No government housing' }] },
  { id: 'CHIRANJEEVI', name: 'Chiranjeevi Swasthya Bima Scheme', description: 'Healthcare coverage for BPL families (Gujarat)', domain: 'HEALTH', budget: 2800000000, beneficiaries: 1000000, eligibility: [{ title: 'Income Category', value: 'BPL cardholders' }, { title: 'Location', value: 'Gujarat residents' }, { title: 'Coverage', value: 'Family-based' }] },
  { id: 'MUDRA', name: 'PM Mudra Yojana', description: 'Micro-loans for small businesses', domain: 'AGRI', budget: 5000000000, beneficiaries: 8000000, eligibility: [{ title: 'Occupation', value: 'Micro-entrepreneur' }, { title: 'Loan Status', value: 'No existing formal loan' }, { title: 'Collateral', value: 'Collateral-free' }] },
  { id: 'NREGA', name: 'MGNREGA', description: '100 days guaranteed employment for rural poor', domain: 'WATER', budget: 10000000000, beneficiaries: 60000000, eligibility: [{ title: 'Location', value: 'Rural areas' }, { title: 'Age', value: '18+ years' }, { title: 'Documentation', value: 'Job card holder' }] },
];

/* ── AI CONFIG ────────────────────────────────────── */
window.GMS.AI_CONFIG = {
  features: [
    { code: 'auto_classify', label: 'Auto-Classification', desc: 'Auto-tag domain & sub-category from text', enabled: true, threshold: 75, model: 'gms-classify-v3' },
    { code: 'severity', label: 'Severity Scoring', desc: 'Compute 0-100 severity from text + evidence', enabled: true, threshold: 80, model: 'gms-severity-v2' },
    { code: 'duplicate', label: 'Duplicate Detection', desc: 'Find similar past grievances', enabled: true, threshold: 72, model: 'gms-dedupe-v1' },
    { code: 'cluster', label: 'Cluster Analysis', desc: 'Group similar location+time grievances', enabled: true, threshold: 65, model: 'gms-cluster-v2' },
    { code: 'sentiment', label: 'Sentiment Analysis', desc: 'Detect citizen distress, anger, neutrality', enabled: true, threshold: 60, model: 'gms-senti-v1' },
    { code: 'sla_predict', label: 'SLA Breach Prediction', desc: 'Predict likelihood of SLA breach', enabled: true, threshold: 70, model: 'gms-sla-v1' },
    { code: 'auto_route', label: 'Auto-Routing', desc: 'Suggest best officer to assign', enabled: true, threshold: 85, model: 'gms-route-v3' },
    { code: 'draft_response', label: 'Response Drafting', desc: 'AI writes draft replies for officers', enabled: true, threshold: 70, model: 'gms-draft-v2' },
    { code: 'translate', label: 'Auto Translation', desc: 'Translate grievance text to officer language', enabled: true, threshold: 90, model: 'gms-trans-v1' },
    { code: 'voice_to_text', label: 'Voice-to-Text', desc: 'Transcribe voice grievances', enabled: true, threshold: 88, model: 'gms-asr-gu-v2' },
  ],
  rateLimit: 1000,
  fallback: 'manual',
  costToday: 47.20,
  callsToday: 12480,
};

/* ── AUDIT LOGS (30 events) ───────────────────────── */
const AUDIT_ACTIONS = [
  { code: 'USER_CREATED', iconName: 'user', color: '#16A34A', label: 'created user' },
  { code: 'USER_UPDATED', iconName: 'edit', color: '#0EA5E9', label: 'updated user' },
  { code: 'USER_DELETED', iconName: 'trash', color: '#DC2626', label: 'deleted user' },
  { code: 'ROLE_CREATED', iconName: 'shield', color: '#7C3AED', label: 'created role' },
  { code: 'ROLE_PERMS_CHANGED', iconName: 'lock', color: '#F59E0B', label: 'modified permissions for' },
  { code: 'SLA_RULE_CREATED', iconName: 'clock', color: '#16A34A', label: 'created SLA rule' },
  { code: 'SLA_RULE_UPDATED', iconName: 'clock', color: '#0EA5E9', label: 'updated SLA rule' },
  { code: 'SLA_RULE_DISABLED', iconName: 'pause', color: '#6B7280', label: 'disabled SLA rule' },
  { code: 'WF_STATE_ADDED', iconName: 'workflow', color: '#16A34A', label: 'added workflow state' },
  { code: 'WF_TRANSITION_CHANGED', iconName: 'refresh', color: '#0EA5E9', label: 'changed workflow transition' },
  { code: 'NOTIF_TPL_UPDATED', iconName: 'bell', color: '#0EA5E9', label: 'updated notification template' },
  { code: 'AI_THRESHOLD_CHANGED', iconName: 'bot', color: '#7C3AED', label: 'tuned AI threshold for' },
  { code: 'CATEGORY_ADDED', iconName: 'tag', color: '#16A34A', label: 'added category' },
  { code: 'HIERARCHY_REORG', iconName: 'tree', color: '#F59E0B', label: 'reorganized hierarchy node' },
  { code: 'LOGIN', iconName: 'lock', color: '#0EA5E9', label: 'logged in' },
  { code: 'EXPORT', iconName: 'download', color: '#0EA5E9', label: 'exported data' },
];

window.GMS.AUDIT_LOGS = (function() {
  const events = [];
  const actors = window.GMS.USERS.filter(u => u.role !== 'OFFICER').slice(0, 6);
  const targets = ['Dr. Anand Patel (U-1003)', 'Smt. Priya Sharma (U-1004)', 'SLA-002 (Hospital Cleanliness Urban)', 'NT-005 (Escalation Template)', 'Health/Drug Shortage', 'AI: severity threshold', 'Workflow: ESCALATED → RESOLVED', 'Hierarchy: D-HFWD', 'Role: District Admin', 'Dr. Suresh Mehta (U-1015)', 'Category: WSS-LEAK', 'Smt. Sonal Kanani (U-1001)', 'Role: Officer', 'AI: duplicate threshold', 'SLA-011 (Drainage Monsoon)', 'NT-001 (Filed Template)'];
  for (let i = 0; i < 30; i++) {
    const a = AUDIT_ACTIONS[i % AUDIT_ACTIONS.length];
    const actor = actors[i % actors.length];
    const target = targets[i % targets.length];
    const m = i * 7;
    const hours = Math.floor(m / 60);
    events.push({
      id: 'AUD-' + (1000 + i),
      ts: hours < 1 ? `${m % 60} min ago` : hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`,
      tsExact: `2026-05-01 ${(11 - (i % 8)).toString().padStart(2,'0')}:${((i * 13) % 60).toString().padStart(2,'0')}`,
      action: a.code,
      actionLabel: a.label,
      iconName: a.iconName,
      color: a.color,
      actor: actor.name,
      actorRole: actor.roleLabel,
      actorId: actor.id,
      target,
      ip: '10.214.' + (i % 30) + '.' + (1 + (i * 17) % 254),
      diff: i % 3 === 0 ? { before: { slaHours: 72 }, after: { slaHours: 48 } } : null,
    });
  }
  return events;
})();

/* ── KPI / DASHBOARD STATS ────────────────────────── */
window.GMS.ADMIN_KPI = {
  totalUsers: 50,
  activeUsers: 42,
  inactiveUsers: 8,
  totalDepts: 8,
  totalCategories: 15,
  totalSlaRules: 25,
  activeSlaRules: 23,
  totalNotifTemplates: 8,
  aiCallsToday: 12480,
  slaComplianceState: 87.4,
  slaComplianceWeek: 84.1,
  alerts: [
    { id: 'AL-1', severity: 'CRITICAL', title: 'SLA-022 (Tribal Area Boost) is unpublished', detail: 'Rule is enabled in draft but never published — 0 grievances using it', iconName: 'alert' },
    { id: 'AL-2', severity: 'HIGH', title: 'Auto-routing confidence dropped to 71%', detail: 'AI model gms-route-v3 below 85% threshold for last 6 hours', iconName: 'bot' },
    { id: 'AL-3', severity: 'MEDIUM', title: '3 users havent logged in for 90+ days', detail: 'Consider deactivating dormant accounts', iconName: 'user' },
    { id: 'AL-4', severity: 'LOW', title: 'New category requested by HFWD', detail: '"Telemedicine consultation issue" — pending approval', iconName: 'tag' },
  ],
  trends: [
    { day: 'Mon', filed: 142, resolved: 128 },
    { day: 'Tue', filed: 168, resolved: 145 },
    { day: 'Wed', filed: 134, resolved: 142 },
    { day: 'Thu', filed: 189, resolved: 156 },
    { day: 'Fri', filed: 217, resolved: 189 },
    { day: 'Sat', filed: 92, resolved: 124 },
    { day: 'Sun', filed: 67, resolved: 88 },
  ],
};

/* ── OPERATORS for rule builder ──────────────────── */
window.GMS.RULE_OPERATORS = [
  { code: 'equals', label: 'equals', symbol: '=' },
  { code: 'not_equals', label: 'not equals', symbol: '≠' },
  { code: 'gt', label: 'greater than', symbol: '>' },
  { code: 'lt', label: 'less than', symbol: '<' },
  { code: 'in', label: 'in list', symbol: '∈' },
  { code: 'any', label: 'any value', symbol: '*' },
];

window.GMS.RULE_FIELDS = [
  { code: 'category', label: 'Category', type: 'select', options: window.GMS.CATEGORIES.map(c => ({ value: c.code, label: c.name })) },
  { code: 'department', label: 'Department', type: 'select', options: window.GMS.DEPARTMENTS.map(d => ({ value: d.code, label: d.name })) },
  { code: 'locationType', label: 'Location Type', type: 'select', options: [{ value: 'URBAN', label: 'Urban' }, { value: 'RURAL', label: 'Rural' }, { value: 'TRIBAL', label: 'Tribal' }] },
  { code: 'severity', label: 'Severity Score', type: 'number' },
  { code: 'priority', label: 'Priority', type: 'select', options: [{ value: 'CRITICAL', label: 'Critical' }, { value: 'HIGH', label: 'High' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'LOW', label: 'Low' }] },
  { code: 'citizenType', label: 'Citizen Type', type: 'select', options: [{ value: 'GENERAL', label: 'General' }, { value: 'SENIOR', label: 'Senior Citizen' }, { value: 'PWD', label: 'Disability (PWD)' }, { value: 'BPL', label: 'Below Poverty Line' }] },
  { code: 'season', label: 'Season', type: 'select', options: [{ value: 'MONSOON', label: 'Monsoon' }, { value: 'WINTER', label: 'Winter' }, { value: 'SUMMER', label: 'Summer' }, { value: 'OFF-SEASON', label: 'Off-season' }] },
  { code: 'source', label: 'Source', type: 'select', options: [{ value: 'WEB', label: 'Web' }, { value: 'MOBILE', label: 'Mobile App' }, { value: 'CALL', label: 'Call Centre' }, { value: 'CMO', label: 'CMO Reference' }] },
];

console.log('[Phase 3 admin-data] Loaded:', {
  roles: window.GMS.ADMIN_ROLES.length,
  users: window.GMS.USERS.length,
  depts: window.GMS.DEPARTMENTS.length,
  categories: window.GMS.CATEGORIES.length,
  slaRules: window.GMS.SLA_RULES.length,
  audit: window.GMS.AUDIT_LOGS.length,
});
