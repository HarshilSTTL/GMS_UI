import { KPIData } from '@/types';

export const OFFICER_KPI: KPIData[] = [
  { label: 'Total Assigned', value: 47, trend: '▲ 5 since yesterday', trendType: 'down', accentColor: '#1A56C4', href: '/portal/complaints' },
  { label: 'Pending Action', value: 18, trend: 'Needs attention', trendType: 'warn', accentColor: '#D97706', href: '/portal/my-work' },
  { label: 'SLA Breached', value: 4, trend: '▲ 2 this week', trendType: 'down', accentColor: '#DC2626', href: '/portal/escalations' },
  { label: 'Resolved Today', value: 11, trend: '▲ 40% vs avg', trendType: 'up', accentColor: '#16A34A', href: '/portal/complaints' },
  { label: 'Grouped Clusters', value: 3, trend: '21 complaints linked', trendType: 'neutral', accentColor: '#EA580C', href: '/portal/grouped' },
];
