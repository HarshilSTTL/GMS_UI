export type ComplaintStatus =
  | 'open'
  | 'pending'
  | 'in_progress'
  | 'under_review'
  | 'resolved'
  | 'escalated'
  | 'acknowledged'
  | 'grouped'
  | 'closed'
  | 'document_requested';

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

export interface TimelineEntry {
  id: string;
  type: 'created' | 'assigned' | 'status_change' | 'resolved' | 'escalated' | 'note' | 'forwarded' | 'reassigned' | 'acknowledged' | 'transferred' | 'reopened' | 'feedback' | 'document_requested' | 'document_resubmitted';
  title: string;
  actor: string;
  actorRole: 'citizen' | 'officer' | 'system';
  timestamp: string;
  description?: string;
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
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail?: string;
  location: string;
  ward?: string;
  district: string;
  assignedTo?: Officer | null;
  groupId?: string | null;
  isGroupPrimary?: boolean;
  timeline: TimelineEntry[];
  feedback?: string | null;
  rating?: number | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  documentRequest?: {
    note: string;
    requestedBy: string;
    requestedByName: string;
    requestedAt: string;
  };
  isResubmitted?: boolean;
  resubmittedAttachmentUrl?: string;
}

export interface ComplaintGroup {
  id: string;
  primaryId: string;
  title: string;
  memberIds: string[];
  createdAt: string;
}

export interface KPIData {
  label: string;
  value: number | string;
  trend?: string;
  trendType?: 'up' | 'down' | 'warn' | 'neutral';
  accentColor: string;
  href?: string;
}
