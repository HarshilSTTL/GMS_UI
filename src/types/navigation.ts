import { UserRole } from './auth';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number | string;
  badgeVariant?: 'red' | 'amber' | 'blue' | 'green';
  children?: NavItem[];
  roles?: UserRole[];
  permission?: string;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
  roles?: UserRole[];
}

export interface SidebarConfig {
  role: UserRole;
  sections: NavSection[];
}
