// Session store that works on both localhost and Vercel
// On localhost: writes to JSON file
// On Vercel: uses in-memory storage (sessions persist during request lifecycle)

import { readJson, writeJson } from './db';

interface Session {
  token: string;
  userId: string;
  role: string;
  createdAt: string;
  expiresAt: string;
}

// In-memory fallback (for Vercel and when file writes fail)
const IN_MEMORY_SESSIONS: Map<string, Session> = new Map();

const IS_VERCEL = process.env.VERCEL === 'true';

export function createSession(token: string, userId: string, role: string): Session {
  const session: Session = {
    token,
    userId,
    role,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  if (IS_VERCEL) {
    // On Vercel, use in-memory only
    IN_MEMORY_SESSIONS.set(token, session);
  } else {
    // On localhost, write to file
    try {
      const sessions = readJson<Session[]>('sessions.json') || [];
      sessions.push(session);
      writeJson('sessions.json', sessions);
    } catch {
      // Fallback to in-memory if write fails
      IN_MEMORY_SESSIONS.set(token, session);
    }
  }

  return session;
}

export function getSession(token: string): Session | null {
  // Always check in-memory first (faster)
  if (IN_MEMORY_SESSIONS.has(token)) {
    return IN_MEMORY_SESSIONS.get(token) || null;
  }

  if (IS_VERCEL) {
    return null; // On Vercel, only in-memory sessions
  }

  // On localhost, try reading from file
  try {
    const sessions = readJson<Session[]>('sessions.json') || [];
    return sessions.find(s => s.token === token) || null;
  } catch {
    return null;
  }
}

export function deleteSession(token: string): void {
  IN_MEMORY_SESSIONS.delete(token);

  if (!IS_VERCEL) {
    try {
      const sessions = readJson<Session[]>('sessions.json') || [];
      const filtered = sessions.filter(s => s.token !== token);
      writeJson('sessions.json', filtered);
    } catch {
      // Ignore write errors
    }
  }
}
