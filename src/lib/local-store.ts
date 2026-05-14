const KEY = 'gms_grievances';

export function addLocalGrievance(g: any) {
  if (typeof window === 'undefined') return;
  try {
    const list = getAllLocalGrievances();
    const deduped = list.filter((x: any) => x.id !== g.id && x.token !== g.token);
    deduped.unshift(g);
    localStorage.setItem(KEY, JSON.stringify(deduped));
  } catch {}
}

export function getAllLocalGrievances(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function getLocalGrievancesByUser(citizenId: string): any[] {
  return getAllLocalGrievances().filter((g: any) => g.citizenId === citizenId);
}

export function findLocalGrievanceByToken(token: string): any | null {
  return getAllLocalGrievances().find((g: any) => g.token === token) || null;
}
