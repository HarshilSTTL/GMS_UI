'use client';
import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Notification {
  id: string; title: string; message: string; timestamp: string; isRead: boolean; type: string; grievanceId?: string;
}

const TYPE_CONFIG: Record<string, { color: string; bg: string }> = {
  status_update: { color: '#1A56C4', bg: '#EBF2FF' },
  assignment: { color: '#7C3AED', bg: '#F5F3FF' },
  resolution: { color: '#16A34A', bg: '#F0FDF4' },
  sla_breach: { color: '#DC2626', bg: '#FEF2F2' },
  acknowledgement: { color: '#0891B2', bg: '#ECFEFF' },
  system: { color: '#7A8FA6', bg: '#F0F2F7' },
};

export default function CitizenNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('gms-auth') || '{}')?.state?.user;
    if (user?.id) {
      fetch(`/api/notifications?userId=${user.id}`).then(r => r.json()).then(d => { setNotifications(d.data || d); setLoading(false); });
    } else { setLoading(false); }
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  async function markRead(id: string) {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notificationId: id }) });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  async function markAllRead() {
    const user = JSON.parse(localStorage.getItem('gms-auth') || '{}')?.state?.user;
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAllRead: true, userId: user?.id }) });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-bold text-[#0E1C2F]">Notifications</h1>
          <p className="text-[11px] text-[#7A8FA6]">{unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="inline-flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold hover:underline">
            <CheckCheck size={14} /> Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(n => {
          const tc = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
          return (
            <div key={n.id} className={`bg-white rounded-[14px] p-4 shadow-[0_1px_3px_rgba(14,28,47,0.08),0_4px_16px_rgba(14,28,47,0.06)] border-l-4 transition-all ${!n.isRead ? 'border-l-blue-500' : 'border-l-transparent'}`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: tc.bg }}>
                  <Bell size={14} style={{ color: tc.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-[12px] ${!n.isRead ? 'font-bold text-[#0E1C2F]' : 'font-semibold text-[#3D5068]'}`}>{n.title}</p>
                    {!n.isRead && (
                      <button onClick={() => markRead(n.id)} className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-1 flex-shrink-0">
                        <Check size={10} /> Mark read
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7A8FA6] mt-0.5 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-[#7A8FA6]">{new Date(n.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    {n.grievanceId && (
                      <Link href={`/citizen/grievances/${n.grievanceId}`} className="text-[10px] text-blue-600 font-semibold hover:underline">View Grievance</Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-[12px] text-[#7A8FA6]">No notifications yet</div>
        )}
      </div>
    </div>
  );
}
