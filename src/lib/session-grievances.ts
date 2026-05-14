// Client-side session store for newly submitted grievances.
// On Vercel, the serverless filesystem is read-only and each request may hit a
// different Lambda instance, so server-side writes are not visible across requests.
// We persist new grievances in sessionStorage so they appear immediately in the UI.

const KEY = 'gms_session_grievances';

export interface SessionGrievance {
  id: string;
  token: string;
  title: string;
  description: string;
  category: string;
  department: string;
  status: string;
  priority: string;
  channel: string;
  slaStatus: string;
  slaDaysLeft: number;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string | null;
  location: string;
  ward: string | null;
  district: string;
  assignedTo: null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: null;
  submittedDate?: string;
  officer?: string;
  officerDept?: string;
  [key: string]: unknown;
}

export function saveSessionGrievance(g: SessionGrievance): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSessionGrievances();
    const deduped = existing.filter(e => e.id !== g.id && e.token !== g.token);
    deduped.unshift(g);
    sessionStorage.setItem(KEY, JSON.stringify(deduped));
  } catch {}
}

export function getSessionGrievances(): SessionGrievance[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function getSessionGrievanceByToken(token: string): SessionGrievance | null {
  return getSessionGrievances().find(g => g.token === token) || null;
}

export function mergeWithSession<T extends { id: string; token?: string }>(
  serverData: T[],
  citizenId: string
): T[] {
  const sessionItems = getSessionGrievances().filter(g => g.citizenId === citizenId);
  if (!sessionItems.length) return serverData;

  const serverIds = new Set(serverData.map(g => g.id));
  const serverTokens = new Set(serverData.map(g => g.token));
  const newItems = sessionItems.filter(
    g => !serverIds.has(g.id) && !serverTokens.has(g.token ?? '')
  );

  return [...(newItems as unknown as T[]), ...serverData];
}
