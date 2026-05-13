// Phase 3 — Mobile Admin View (approvals queue + alerts + audit feed)
const { useState: useStateM } = React;

window.AdminMobile = function AdminMobile({ role, addToast, showAI, lang }) {
  const [tab, setTab] = useStateM('home');
  const k = window.GMS.ADMIN_KPI;
  const audits = window.GMS.AUDIT_LOGS.slice(0, 8);
  const pendingApprovals = [
    { id: 'AP-1', type: 'New User', detail: 'Dr. Mehul Joshi · CDHO Surat', from: 'HR System', age: '2h', icon: 'user', color: '#0EA5E9' },
    { id: 'AP-2', type: 'SLA Rule Change', detail: 'SLA-002 hours: 48 → 36', from: 'Dr. Anand Patel', age: '4h', icon: 'clock', color: '#F59E0B' },
    { id: 'AP-3', type: 'New Category', detail: 'Telemedicine consultation issue', from: 'HFWD', age: '1d', icon: 'tag', color: '#7C3AED' },
    { id: 'AP-4', type: 'Hierarchy Change', detail: 'Move 3 employees: Branch A → B', from: 'Smt. Priya Sharma', age: '1d', icon: 'tree', color: '#16A34A' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: '#F4F2EE', display: 'flex', flexDirection: 'column', fontFamily: '"Inter", system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 12px', background: 'linear-gradient(135deg, #0F1A2E, #1A3260)', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="Emblem.png" alt="Emblem of India" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Admin Console</div>
            <div style={{ fontSize: 10.5, opacity: 0.7 }}>{role.scopeName}</div>
          </div>
          <button style={{ width: 34, height: 34, borderRadius: 7, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="bell" size={16} /><span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', background: '#FF8C42' }}></span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px 18px' }}>
        {tab === 'home' && (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F1A2E', marginBottom: 8 }}>System Snapshot</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { lbl: 'Active Users', val: k.activeUsers, sub: '/' + k.totalUsers, color: '#0EA5E9' },
                  { lbl: 'SLA Compliance', val: k.slaComplianceState + '%', sub: 'this month', color: '#16A34A' },
                  { lbl: 'Active Rules', val: k.activeSlaRules, sub: '/' + k.totalSlaRules, color: '#7C3AED' },
                  { lbl: 'Alerts', val: k.alerts.length, sub: 'pending', color: '#DC2626' },
                ].map((c, i) => (
                  <div key={i} style={{ background: '#fff', padding: 11, borderRadius: 9, border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: 10.5, color: '#6B7280', fontWeight: 500 }}>{c.lbl}</div>
                    <div style={{ fontSize: 19, fontWeight: 700, color: c.color, marginTop: 3 }}>{c.val}<span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}> {c.sub}</span></div>
                  </div>
                ))}
              </div>
            </div>

            {showAI && (
              <div style={{ padding: 12, background: 'linear-gradient(135deg, #FAF5FF, #fff)', border: '1px solid #E9D5FF', borderRadius: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg, #7C3AED, #DB2777)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="sparkles" size={12} /></span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>AI Insight</span>
                </div>
                <div style={{ fontSize: 11.5, color: '#374151', lineHeight: 1.55 }}>SLA-022 (Tribal Area Boost) is unpublished but enabled. Consider activating to apply 50% SLA reduction for tribal areas.</div>
              </div>
            )}

            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center' }}>System Alerts <span style={{ marginLeft: 7, padding: '1px 6px', background: '#DC2626', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 9 }}>{k.alerts.length}</span></div>
            {k.alerts.slice(0, 3).map(a => {
              const sevColor = { CRITICAL: '#DC2626', HIGH: '#F59E0B', MEDIUM: '#0EA5E9', LOW: '#6B7280' }[a.severity];
              return (
                <div key={a.id} style={{ background: '#fff', padding: 11, borderRadius: 9, border: '1px solid #E5E7EB', borderLeft: `3px solid ${sevColor}`, marginBottom: 7, display: 'flex', gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={a.iconName || 'alert'} size={14} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0F1A2E' }}>{a.title}</div>
                    <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 3, lineHeight: 1.5 }}>{a.detail}</div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {tab === 'approvals' && (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Pending Approvals <span style={{ marginLeft: 5, fontSize: 11, color: '#6B7280', fontWeight: 500 }}>({pendingApprovals.length})</span></div>
            {pendingApprovals.map(a => (
              <div key={a.id} style={{ background: '#fff', padding: 12, borderRadius: 10, border: '1px solid #E5E7EB', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 7, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={a.icon} size={16} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{a.type}</div>
                    <div style={{ fontSize: 10.5, color: '#6B7280' }}>{a.from} · {a.age} ago</div>
                  </div>
                </div>
                <div style={{ fontSize: 11.5, color: '#374151', marginBottom: 10, lineHeight: 1.5 }}>{a.detail}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => addToast(a.type + ' approved')} style={{ flex: 1, padding: '8px', borderRadius: 6, border: 'none', background: '#16A34A', color: '#fff', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Icon name="check" size={13} /> Approve</button>
                  <button onClick={() => addToast(a.type + ' rejected')} style={{ flex: 1, padding: '8px', borderRadius: 6, border: '1px solid #FCA5A5', background: '#fff', color: '#DC2626', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Icon name="x" size={13} /> Reject</button>
                  <button style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="external" size={13} /></button>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'audit' && (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Recent Audit Activity</div>
            {audits.map(l => (
              <div key={l.id} style={{ display: 'flex', gap: 9, padding: 11, background: '#fff', borderRadius: 8, border: '1px solid #E5E7EB', marginBottom: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={l.iconName || 'log'} size={13} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, color: '#0F1A2E', lineHeight: 1.5 }}><b>{l.actor.replace(/^(Smt\.|Shri|Dr\.) /, '')}</b> {l.actionLabel} <b style={{ color: '#FF8C42' }}>{l.target}</b></div>
                  <div style={{ fontSize: 10, color: '#6B7280', marginTop: 3 }}>{l.ts}</div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'me' && (
          <>
            <div style={{ background: '#fff', padding: 16, borderRadius: 11, border: '1px solid #E5E7EB', marginBottom: 11, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: role.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, margin: '0 auto 9px' }}>{role.avatar}</div>
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>{role.personName}</div>
              <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>{role.personTitle}</div>
              <div style={{ fontSize: 11, color: role.color, fontWeight: 600, marginTop: 5 }}>{role.name} · {role.scopeName}</div>
            </div>
            {[
              { i: 'lock', c: '#7C3AED', l: 'My Permissions', sub: role.id === 'SUPER' ? 'All modules' : `${Object.values(window.GMS.ROLE_PERMS[role.id] || {}).flat().length} permissions` },
              { i: 'barChart', c: '#0EA5E9', l: 'My Activity', sub: 'Last 30 days · 47 actions' },
              { i: 'globe', c: '#16A34A', l: 'Language', sub: lang === 'gu' ? 'ગુજરાતી' : lang === 'hi' ? 'हिन्दी' : 'English' },
              { i: 'bell', c: '#F59E0B', l: 'Notifications', sub: 'SMS + Email enabled' },
              { i: 'key', c: '#6B7280', l: 'Change Password', sub: 'Last changed 23 days ago' },
              { i: 'logOut', c: '#DC2626', l: 'Sign Out', sub: '' },
            ].map((m, i) => (
              <button key={i} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, padding: 12, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 9, marginBottom: 6, fontFamily: 'inherit', cursor: 'pointer' }}>
                <span style={{ width: 30, height: 30, borderRadius: 7, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={m.i} size={15} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0F1A2E' }}>{m.l}</div>
                  {m.sub && <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 2 }}>{m.sub}</div>}
                </div>
                <span style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center' }}><Icon name="chevronRight" size={14} /></span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid #E5E7EB', background: '#fff' }}>
        {[
          { id: 'home', i: 'home', l: 'Home' },
          { id: 'approvals', i: 'check', l: 'Approvals', badge: pendingApprovals.length },
          { id: 'audit', i: 'scroll', l: 'Audit' },
          { id: 'me', i: 'user', l: 'Me' },
        ].map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '9px 6px 11px', border: 'none', background: 'transparent', textAlign: 'center', position: 'relative', cursor: 'pointer', fontFamily: 'inherit', color: active ? '#FF8C42' : '#6B7280' }}>
              <div style={{ marginBottom: 2, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={t.i} size={18} />
                {t.badge > 0 && <span style={{ position: 'absolute', top: -5, right: -10, padding: '1px 4px', fontSize: 9, fontWeight: 700, background: '#DC2626', color: '#fff', borderRadius: 7, minWidth: 14, lineHeight: 1.2 }}>{t.badge}</span>}
              </div>
              <div style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? '#FF8C42' : '#6B7280' }}>{t.l}</div>
              {active && <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 2, background: '#FF8C42', borderRadius: '0 0 2px 2px' }}></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
