import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const IS_VERCEL = process.env.VERCEL === 'true';

export function readJson<T>(filename: string): T {
  try {
    const file = path.join(DATA_DIR, filename);
    if (!fs.existsSync(file)) {
      return [] as unknown as T;
    }
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to read ${filename}:`, error);
    return [] as unknown as T;
  }
}

export function writeJson<T>(filename: string, data: T): void {
  const file = path.join(DATA_DIR, filename);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

export function nextId(items: { id: string }[], prefix: string): string {
  const nums = items
    .map(i => parseInt(i.id.replace(prefix, ''), 10))
    .filter(n => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `${prefix}${max + 1}`;
}

export function generateToken(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(10000 + Math.random() * 90000));
  return `GJ-${year}-${num}`;
}

export function generateSessionToken(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(i => i.id === id);
}

export function updateById<T extends { id: string }>(items: T[], id: string, updates: Partial<T>): T[] {
  return items.map(i => i.id === id ? { ...i, ...updates } : i);
}

export function removeById<T extends { id: string }>(items: T[], id: string): T[] {
  return items.filter(i => i.id !== id);
}
