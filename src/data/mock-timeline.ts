import { TimelineEvent } from '@/types';

export const MOCK_TIMELINES: Record<string, TimelineEvent[]> = {
  c1: [
    { id: 't1', type: 'created', title: 'Complaint filed by citizen', description: 'Filed via WhatsApp. Auto-classified by AI with 94% confidence — Water Supply category.', actor: 'Rajesh Patel', actorInitials: 'RP', actorColor: '#0891B2', timestamp: '2025-05-05T09:41:00Z', icon: '✓', iconBg: '#F0FDF4' },
    { id: 't2', type: 'assigned', title: 'AI classified & auto-assigned to GWSSB', description: 'SLA set to 5 days. Department: GWSSB Zone 3.', actor: 'GMS System', actorInitials: 'AI', actorColor: '#7C3AED', timestamp: '2025-05-05T09:41:30Z', icon: '🤖', iconBg: '#F5F3FF' },
    { id: 't3', type: 'assigned', title: 'Assigned to Ravi Varma', description: 'Nodal Officer assigned complaint after initial review.', actor: 'Ravi Varma', actorInitials: 'RV', actorColor: '#1A56C4', timestamp: '2025-05-05T11:00:00Z', icon: '✓', iconBg: '#EBF2FF' },
    { id: 't4', type: 'updated', title: 'Field visit scheduled', description: 'Zone 3 supervisor informed. Checking valve status remotely. Pipeline map for Ward 7 retrieved.', actor: 'Ravi Varma', actorInitials: 'RV', actorColor: '#1A56C4', timestamp: '2025-05-06T14:30:00Z', icon: '⏳', iconBg: '#EBF2FF' },
  ],
  c2: [
    { id: 't1', type: 'created', title: 'Complaint filed via Web portal', description: 'Road pothole on SG Highway. Auto-classified as Roads & Infrastructure.', actor: 'Meena Joshi', actorInitials: 'MJ', actorColor: '#D97706', timestamp: '2025-05-02T11:20:00Z', icon: '✓', iconBg: '#F0FDF4' },
    { id: 't2', type: 'assigned', title: 'Assigned to Pooja Desai (Nodal, RTO)', description: 'Routed to Roads & Buildings department.', actor: 'GMS System', actorInitials: 'AI', actorColor: '#7C3AED', timestamp: '2025-05-02T11:21:00Z', icon: '🤖', iconBg: '#F5F3FF' },
    { id: 't3', type: 'escalated', title: 'SLA Breached — Auto-escalated to L2', description: 'Complaint exceeded 5-day SLA window without resolution. Escalated automatically.', actor: 'GMS System', actorInitials: 'AI', actorColor: '#DC2626', timestamp: '2025-05-07T08:00:00Z', icon: '🚨', iconBg: '#FEF2F2' },
  ],
  c3: [
    { id: 't1', type: 'created', title: 'Complaint filed via Mobile App', description: 'Sanitation issue — garbage not collected.', actor: 'Sunita Rao', actorInitials: 'SR', actorColor: '#16A34A', timestamp: '2025-05-03T08:45:00Z', icon: '✓', iconBg: '#F0FDF4' },
    { id: 't2', type: 'assigned', title: 'Assigned to Anita Sharma', description: 'Routed to AMC Sanitation department.', actor: 'Ravi Varma', actorInitials: 'RV', actorColor: '#1A56C4', timestamp: '2025-05-03T09:30:00Z', icon: '✓', iconBg: '#EBF2FF' },
    { id: 't3', type: 'updated', title: 'AMC sanitation team notified', description: 'Supervisor contacted. Truck rescheduled for next pickup. Citizen notified via SMS.', actor: 'Anita Sharma', actorInitials: 'AS', actorColor: '#16A34A', timestamp: '2025-05-04T10:00:00Z', icon: '📤', iconBg: '#F0FDF4' },
  ],
};

export const MOCK_COMM_LOGS: Record<string, Array<{
  id: string; title: string; message: string; channels: string[];
  actor: string; timestamp: string; icon: string; iconBg: string;
}>> = {
  c1: [
    {
      id: 'cl1', title: 'Case acknowledged by officer',
      message: 'We have received your complaint regarding water supply disruption in Ward 7. Your case has been acknowledged and assigned to our engineer. Token: GVM-2025-05341.',
      channels: ['SMS'], actor: 'GMS System', timestamp: '2025-05-05T09:45:00Z', icon: '✋', iconBg: '#F0FDF4',
    },
    {
      id: 'cl2', title: 'Field visit scheduled — citizen informed',
      message: 'Your grievance GVM-2025-05341 is being actively worked on. Our engineer has scheduled a field visit for tomorrow 10 AM at your location. You will receive an update by end of day.',
      channels: ['SMS', 'Email'], actor: 'Ravi Varma', timestamp: '2025-05-06T15:42:00Z', icon: '📤', iconBg: '#EBF2FF',
    },
  ],
};
