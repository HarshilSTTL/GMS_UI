import { NextRequest } from 'next/server';
import { readJson } from '@/lib/db';
import type { Complaint } from '@/types';

type Ctx = { params: Promise<{ userId: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { userId } = await ctx.params;
  const complaints = readJson<Complaint[]>('complaints.json');

  // Filter by citizenEmail or return sample data for demo purposes
  // In production, complaints would have a citizenUserId field
  const citizenComplaints = complaints.filter(c =>
    c.citizenEmail === 'citizen@gmail.com' ||
    c.citizenEmail === 'rajesh@gmail.com' ||
    c.citizenEmail?.includes('gmail.com')
  );

  // If no matching complaints, return first 5 for demo
  const result = citizenComplaints.length > 0 ? citizenComplaints : complaints.slice(0, 5);

  return Response.json(result);
}
