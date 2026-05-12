import { NavSection, UserRole } from '@/types';

const OFFICER_NAV: NavSection[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/portal/dashboard', badge: undefined },
      { id: 'complaints', label: 'All Complaints', icon: 'ClipboardList', path: '/portal/complaints', badge: 12, badgeVariant: 'red' },
      { id: 'mywork', label: 'My Work Queue', icon: 'CheckSquare', path: '/portal/my-work', badge: 5, badgeVariant: 'amber' },
      { id: 'grouped', label: 'Grouped Cases', icon: 'Link2', path: '/portal/grouped', badge: 3, badgeVariant: 'blue' },
    ],
  },
  {
    id: 'nodal_tools',
    label: 'Nodal Tools',
    items: [
      { id: 'reassign', label: 'Reassign / Route', icon: 'ArrowUpRight', path: '/portal/reassign' },
      { id: 'team', label: 'My Team', icon: 'Users', path: '/portal/team' },
      { id: 'escalations', label: 'Escalations', icon: 'AlertTriangle', path: '/portal/escalations', badge: 3, badgeVariant: 'red' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    items: [
      { id: 'sla_reports', label: 'SLA Reports', icon: 'BarChart2', path: '/portal/reports' },
    ],
  },
];

const CLERK_NAV: NavSection[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/portal/dashboard' },
      { id: 'complaints', label: 'All Complaints', icon: 'ClipboardList', path: '/portal/complaints', badge: 12, badgeVariant: 'red' },
      { id: 'mywork', label: 'My Work Queue', icon: 'CheckSquare', path: '/portal/my-work', badge: 8, badgeVariant: 'amber' },
      { id: 'grouped', label: 'Grouped Cases', icon: 'Link2', path: '/portal/grouped', badge: 3, badgeVariant: 'blue' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    items: [
      { id: 'sla_reports', label: 'SLA Reports', icon: 'BarChart2', path: '/portal/reports' },
    ],
  },
];

const ADMIN_NAV: NavSection[] = [
  {
    id: 'console',
    label: 'Admin Console',
    items: [
      { id: 'overview', label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin/overview' },
      { id: 'users', label: 'User Management', icon: 'Users', path: '/admin/users' },
      { id: 'roles', label: 'Roles & Permissions', icon: 'Shield', path: '/admin/roles' },
      { id: 'hierarchy', label: 'Hierarchy Builder', icon: 'Building2', path: '/admin/hierarchy' },
      { id: 'categories', label: 'Categories', icon: 'Radio', path: '/admin/categories' },
    ],
  },
  {
    id: 'rules',
    label: 'Rules & Workflow',
    items: [
      { id: 'sla', label: 'SLA Rule Engine', icon: 'BarChart2', path: '/admin/sla' },
      { id: 'workflow', label: 'Workflow Configuration', icon: 'Settings', path: '/admin/workflow' },
      { id: 'escalation', label: 'Escalation Matrix', icon: 'AlertTriangle', path: '/admin/escalation' },
      { id: 'notif', label: 'Notifications', icon: 'MessageSquare', path: '/admin/notifications' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { id: 'ai', label: 'AI Configuration', icon: 'Zap', path: '/admin/ai-config' },
      { id: 'master', label: 'Master Data', icon: 'Globe2', path: '/admin/master' },
      { id: 'audit', label: 'Audit Logs', icon: 'ScrollText', path: '/admin/audit' },
    ],
  },
];

const CM_NAV: NavSection[] = [
  {
    id: 'views',
    label: 'Views',
    items: [
      { id: 'overview', label: 'State Overview', icon: 'Globe2', path: '/cm/overview' },
      { id: 'departments', label: 'All Departments', icon: 'Building2', path: '/cm/departments' },
      { id: 'districts', label: 'Districts Heat Map', icon: 'MapPin', path: '/cm/districts', badge: 3, badgeVariant: 'red' },
      { id: 'csat', label: 'CSAT Analysis', icon: 'Star', path: '/cm/csat' },
      { id: 'trends', label: 'Trend Intelligence', icon: 'TrendingUp', path: '/cm/trends' },
      { id: 'actions', label: 'AI Action Board', icon: 'Zap', path: '/cm/actions', badge: 7, badgeVariant: 'amber' },
      { id: 'critical', label: 'Critical Complaints', icon: 'AlertCircle', path: '/cm/critical' },
      { id: 'breached', label: 'SLA Breached', icon: 'AlertTriangle', path: '/cm/breached' },
    ],
  },
];

const CITIZEN_NAV: NavSection[] = [
  {
    id: 'main',
    label: 'Grievance Portal',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/citizen/dashboard' },
      { id: 'complaints', label: 'My Complaints', icon: 'ClipboardList', path: '/citizen/complaints' },
      { id: 'file', label: 'File New', icon: 'FileText', path: '/citizen/file-complaint', badge: undefined },
      { id: 'track', label: 'Track Status', icon: 'Eye', path: '/citizen/track' },
    ],
  },
];

export const NAV_CONFIG: Record<UserRole, NavSection[]> = {
  nodal_officer: OFFICER_NAV,
  clerk: CLERK_NAV,
  admin: ADMIN_NAV,
  cm: CM_NAV,
  citizen: CITIZEN_NAV,
};

export function getNavForRole(role: UserRole): NavSection[] {
  return NAV_CONFIG[role] ?? [];
}

export function getDefaultPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    nodal_officer: '/portal/dashboard',
    clerk: '/portal/dashboard',
    admin: '/admin/overview',
    cm: '/cm/overview',
    citizen: '/citizen/dashboard',
  };
  return paths[role] ?? '/portal/dashboard';
}
