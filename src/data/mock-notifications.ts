export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'escalation' | 'assignment' | 'sla_breach' | 'resolution' | 'system';
  link?: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'SLA Breach — Critical',
    message: 'GVM-2025-05289 has breached SLA. Immediate action required.',
    timestamp: '2025-05-07T08:00:00Z',
    isRead: false,
    type: 'sla_breach',
    link: '/portal/complaints/c2',
  },
  {
    id: 'n2',
    title: 'New Escalation',
    message: 'GVM-2025-05200 escalated to L2 by citizen. Review needed.',
    timestamp: '2025-05-07T07:30:00Z',
    isRead: false,
    type: 'escalation',
    link: '/portal/escalations',
  },
  {
    id: 'n3',
    title: 'Complaint Assigned',
    message: 'GVM-2025-05425 has been assigned to your team.',
    timestamp: '2025-05-07T06:45:00Z',
    isRead: false,
    type: 'assignment',
    link: '/portal/complaints/c10',
  },
  {
    id: 'n4',
    title: 'Resolved Successfully',
    message: 'GVM-2025-05234 resolved by Ravi Varma. CSAT pending.',
    timestamp: '2025-05-05T17:00:00Z',
    isRead: true,
    type: 'resolution',
  },
  {
    id: 'n5',
    title: 'System Maintenance',
    message: 'GMS Portal maintenance scheduled for May 10, 2:00–4:00 AM.',
    timestamp: '2025-05-06T10:00:00Z',
    isRead: true,
    type: 'system',
  },
];
