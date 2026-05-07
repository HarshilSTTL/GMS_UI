export type ComplaintStatus =
  | 'open'
  | 'in_progress'
  | 'under_review'
  | 'resolved'
  | 'escalated'
  | 'acknowledged'
  | 'grouped';

export type ComplaintPriority = 'critical' | 'high' | 'medium' | 'low';

export type ComplaintChannel =
  | 'web'
  | 'mobile'
  | 'whatsapp'
  | 'call'
  | 'email'
  | 'walk_in';

export type SLAStatus = 'ok' | 'warn' | 'breach';

export interface Officer {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  department: string;
  workload: 'ok' | 'high' | 'full';
}

export interface Complaint {
  id: string;
  token: string;
  title: string;
  description: string;
  category: string;
  department: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  channel: ComplaintChannel;
  slaStatus: SLAStatus;
  slaDaysLeft: number;
  citizenName: string;
  citizenPhone: string;
  citizenEmail?: string;
  location: string;
  ward?: string;
  district: string;
  assignedTo?: Officer;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  groupId?: string;
  isGroupPrimary?: boolean;
}

export interface ComplaintGroup {
  id: string;
  primaryId: string;
  title: string;
  memberIds: string[];
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'assigned' | 'updated' | 'escalated' | 'resolved' | 'note' | 'communication';
  title: string;
  description?: string;
  actor: string;
  actorInitials: string;
  actorColor: string;
  timestamp: string;
  icon: string;
  iconBg: string;
}

export interface KPIData {
  label: string;
  value: number | string;
  trend?: string;
  trendType?: 'up' | 'down' | 'warn' | 'neutral';
  accentColor: string;
}
