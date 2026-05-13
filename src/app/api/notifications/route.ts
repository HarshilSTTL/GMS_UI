import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';

// GET /api/notifications?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const notifications = readJson<any[]>('notifications.json');
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let filtered = notifications;
    if (userId) {
      filtered = notifications.filter(n => n.userId === userId);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ data: filtered, total: filtered.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications.' }, { status: 500 });
  }
}

// PATCH /api/notifications — Mark as read
export async function PATCH(request: NextRequest) {
  try {
    const { notificationId, markAllRead, userId } = await request.json();
    const notifications = readJson<any[]>('notifications.json');

    if (markAllRead && userId) {
      notifications.forEach(n => {
        if (n.userId === userId) n.isRead = true;
      });
    } else if (notificationId) {
      const notif = notifications.find(n => n.id === notificationId);
      if (notif) notif.isRead = true;
    }

    writeJson('notifications.json', notifications);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notifications.' }, { status: 500 });
  }
}
