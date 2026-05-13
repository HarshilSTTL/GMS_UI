import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.join(process.cwd(), 'logs');
const IS_VERCEL = process.env.VERCEL === 'true';

function ensureLogsDir() {
  // Skip on Vercel (read-only filesystem)
  if (IS_VERCEL) return;

  try {
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }
  } catch {
    // Ignore errors on read-only filesystem
  }
}

function getLogFilePath(): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  return path.join(LOGS_DIR, `${dateStr}.md`);
}

function formatTimestamp(): string {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'ACTION' | 'AUTH' | 'DATA';

export function log(level: LogLevel, task: string, details?: string) {
  // Skip file logging on Vercel (read-only filesystem)
  if (IS_VERCEL) return;

  try {
    ensureLogsDir();
    const logFile = getLogFilePath();
    const time = formatTimestamp();
    const entry = details
      ? `- **[${time}]** [${level}] ${task}\n  \`${details}\`\n`
      : `- **[${time}]** [${level}] ${task}\n`;

    // If file doesn't exist, create with header
    if (!fs.existsSync(logFile)) {
      const header = `# Log File - ${new Date().toISOString().split('T')[0]}\n\n`;
      fs.writeFileSync(logFile, header + entry, 'utf-8');
    } else {
      fs.appendFileSync(logFile, entry, 'utf-8');
    }
  } catch {
    // Ignore write errors on read-only filesystem
  }
}

export function logAction(action: string, userId: string, details?: string) {
  log('ACTION', `${action} by ${userId}`, details);
}

export function logAuth(event: string, userId: string, details?: string) {
  log('AUTH', `${event} - ${userId}`, details);
}

export function logData(operation: string, resource: string, resourceId?: string) {
  const detail = resourceId ? `${resource}/${resourceId}` : resource;
  log('DATA', `${operation} on ${detail}`);
}

export function logError(error: string, context?: string) {
  log('ERROR', error, context);
}
