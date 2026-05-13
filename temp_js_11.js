// Phase 3 — Modules A: Dashboard, Users, Roles, Hierarchy
const { useState: useStateA, useMemo: useMemoA, useEffect: useEffectA } = React;

/* ═══════════════ M1: ADMIN DASHBOARD ═══════════════ */
window.AdminDashboard = function AdminDashboard({ role, showAI, onNav, addToast }) {
  const k = window.GMS.ADMIN_KPI;
  const trends = k.trends;
  const maxTrend = Math.max(...trends.flatMap(t => [t.filed, t.resolved]));

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        sub={`Welcome back, ${role.personName.replace(/^(Smt\.|Shri|Dr\.) /, '')} · ${role.scopeName}`}
        actions={<><Btn><Icon name="download" size={12} style={{marginRight:4}} />Export Report</Btn><Btn kind="primary"><Icon name="plus" size={12} style={{marginRight:4}} />Quick Setup</Btn></>}
      />

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 18 }}>
        {[
          { label: 'Total Users', val: k.totalUsers, sub: `${k.activeUsers} active`, icon: 'users', color: '#0EA5E9' },
          { label: 'Departments', val: k.totalDepts, sub: `${k.totalCategories} categories`, icon: 'building', color: '#7C3AED' },
          { label: 'SLA Rules', val: k.totalSlaRules, sub: `${k.activeSlaRules} active`, icon: 'clock', color: '#16A34A' },
          { label: 'SLA Compliance', val: k.slaComplianceState + '%', sub: 'this month', icon: 'trending', color: '#F59E0B' },
          { label: 'AI Calls Today', val: (k.aiCallsToday / 1000).toFixed(1) + 'k', sub: '$47.20 spend', icon: 'bot', color: '#DC2626' },
        ].map((c, i) => (
          <Card key={i} padding={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={c.icon} size={18} /></div>
              <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{c.label}</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, color: '#0F1A2E', lineHeight: 1 }}>{c.val}</div>
            <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 5 }}>{c.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 14, marginBottom: 18 }}>
        {/* Trends chart */}
        <Card padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F1A2E' }}>Complaint Trends</div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Filed vs Resolved · Last 7 days</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, fontSize: 11, color: '#6B7280' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: '#0EA5E9' }}></span>Filed</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: '#16A34A' }}></span>Resolved</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: 180, gap: 18, padding: '0 6px' }}>
            {trends.map((t, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 150 }}>
                  <div style={{ width: 16, background: '#0EA5E9', borderRadius: '3px 3px 0 0', height: (t.filed / maxTrend) * 150 + 'px' }} title={t.filed}></div>
                  <div style={{ width: 16, background: '#16A34A', borderRadius: '3px 3px 0 0', height: (t.resolved / maxTrend) * 150 + 'px' }} title={t.resolved}></div>
                </div>
                <div style={{ fontSize: 10.5, color: '#6B7280', fontWeight: 500 }}>{t.day}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        {showAI && (
          <Card padding={18} style={{ background: 'linear-gradient(135deg, #FAF5FF, #fff)', border: '1px solid #E9D5FF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #7C3AED, #DB2777)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="sparkles" size={14} /></div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>AI Audit Insights</div>
              <span style={{ marginLeft: 'auto', fontSize: 9.5, color: '#7C3AED', fontWeight: 600 }}>WEEKLY</span>
            </div>
            {[
              { t: 'Rule conflict detected', d: 'SLA-002 and SLA-020 may overlap for senior citizens with hospital cleanliness complaints. Review priority order.', a: 'Review' },
              { t: 'Unused configuration', d: 'NT-007 (SLA Breach internal) hasn\'t fired in 30 days. Confirm trigger logic.', a: 'Inspect' },
              { t: 'Hierarchy gap', d: '12 officers in HFWD have no reporting manager assigned. Recommend back-filling.', a: 'Fix' },
            ].map((x, i) => (
              <div key={i} style={{ padding: '10px 12px', background: '#fff', borderRadius: 8, border: '1px solid #E9D5FF', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0F1A2E', marginBottom: 4 }}>{x.t}</div>
                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>{x.d}</div>
                <button style={{ marginTop: 6, fontSize: 10.5, color: '#7C3AED', fontWeight: 700, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>{x.a} →</button>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Alerts + Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card padding={18}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="alert" size={15} color="#F59E0B" />System Alerts</div>
            <span style={{ marginLeft: 8, padding: '1px 6px', background: '#DC2626', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 9 }}>{k.alerts.length}</span>
            <button style={{ marginLeft: 'auto', fontSize: 11, color: '#1A3260', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
          </div>
          {k.alerts.map(a => {
            const sevColor = { CRITICAL: '#DC2626', HIGH: '#F59E0B', MEDIUM: '#0EA5E9', LOW: '#6B7280' }[a.severity];
            return (
              <div key={a.id} style={{ padding: 11, marginBottom: 7, borderRadius: 8, border: '1px solid #E5E7EB', borderLeft: `3px solid ${sevColor}`, display: 'flex', gap: 10 }}>
                <div style={{ display: 'flex' }}><Icon name="alert" size={16} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0F1A2E' }}>{a.title}</div>
                    <PriorityBadge p={a.severity} />
                  </div>
                  <div style={{ fontSize: 10.5, color: '#6B7280', lineHeight: 1.5 }}>{a.detail}</div>
                </div>
              </div>
            );
          })}
        </Card>

        <Card padding={18}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Quick Configuration</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
            {[
              { id: 'sla', icon: 'clock', label: 'New SLA Rule', sub: '25 active' },
              { id: 'users', icon: 'user', label: 'Add User', sub: '50 total' },
              { id: 'workflow', icon: 'workflow', label: 'Edit Workflow', sub: '9 states' },
              { id: 'notif', icon: 'bell', label: 'Templates', sub: '8 configured' },
              { id: 'ai', icon: 'bot', label: 'AI Settings', sub: '10 features' },
              { id: 'audit', icon: 'log', label: 'Audit Trail', sub: '30 events' },
            ].map(q => (
              <button key={q.id} onClick={() => onNav(q.id)} style={{ padding: '13px 12px', borderRadius: 9, border: '1px solid #E5E7EB', background: '#F9FAFB', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#FF8C42'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#E5E7EB'; }}>
                <div style={{ marginBottom: 6, color: '#FF8C42' }}><Icon name={q.icon} size={18} /></div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0F1A2E' }}>{q.label}</div>
                <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>{q.sub}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════ M2: USER MANAGEMENT ═══════════════ */
window.AdminUsers = function AdminUsers({ role, addToast, showAI }) {
  const [users, setUsers] = useStateA(window.GMS.USERS);
  const [filter, setFilter] = useStateA({ q: '', role: 'ALL', dept: 'ALL', status: 'ALL' });
  const [selected, setSelected] = useStateA(null);
  const [showCreate, setShowCreate] = useStateA(false);
  const [showBulk, setShowBulk] = useStateA(false);

  const filtered = users.filter(u =>
    (filter.q === '' || (u.name + u.email).toLowerCase().includes(filter.q.toLowerCase())) &&
    (filter.role === 'ALL' || u.role === filter.role) &&
    (filter.dept === 'ALL' || u.dept === filter.dept) &&
    (filter.status === 'ALL' || u.status === filter.status)
  );

  return (
    <div>
      <PageHeader
        title="User Management"
        sub={`${users.length} users · ${users.filter(u => u.status === 'ACTIVE').length} active`}
        actions={<><Btn onClick={() => setShowBulk(true)}><Icon name="upload" size={12} style={{marginRight:4}} />Bulk Upload</Btn><Btn kind="primary" onClick={() => setShowCreate(true)}><Icon name="plus" size={12} style={{marginRight:4}} />Add User</Btn></>}
      />

      <Card padding={14} style={{ marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10 }}>
          <input placeholder="Search by name, email…" value={filter.q} onChange={e => setFilter({...filter, q: e.target.value})} style={inputStyle} />
          <select value={filter.role} onChange={e => setFilter({...filter, role: e.target.value})} style={inputStyle}>
            <option value="ALL">All roles</option><option value="SUPER">Super Admin</option><option value="DEPT">Dept Admin</option><option value="DIST">District Admin</option><option value="OFFICER">Officer</option>
          </select>
          <select value={filter.dept} onChange={e => setFilter({...filter, dept: e.target.value})} style={inputStyle}>
            <option value="ALL">All depts</option>
            {window.GMS.DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
          </select>
          <select value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})} style={inputStyle}>
            <option value="ALL">All status</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </Card>

      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              {['User', 'Role', 'Department', 'District', 'Status', 'Last Login', ''].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', letterSpacing: 0.4, textTransform: 'uppercase' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 20).map(u => {
              const dept = window.GMS.DEPARTMENTS.find(d => d.code === u.dept);
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }} onClick={() => setSelected(u)} onMouseEnter={e => e.currentTarget.style.background = '#FAFBFC'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1A3260', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{u.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0F1A2E' }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 11.5 }}>
                    <span style={{ padding: '2px 7px', borderRadius: 4, background: u.role === 'SUPER' ? '#FEF3C7' : u.role === 'DEPT' ? '#DBEAFE' : u.role === 'DIST' ? '#DCFCE7' : '#F3F4F6', color: '#0F1A2E', fontWeight: 600, fontSize: 10.5 }}>{u.roleLabel}</span>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 11.5 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name={dept.iconName || 'folder'} size={13} /> {dept.name}</span>
                  </td>
                  <td style={{ padding: '11px 14px', color: '#0F1A2E' }}>{u.district}</td>
                  <td style={{ padding: '11px 14px' }}><StatusBadge status={u.status} /></td>
                  <td style={{ padding: '11px 14px', fontSize: 11, color: '#6B7280' }}>{u.lastLogin}</td>
                  <td style={{ padding: '11px 14px' }}><button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'inline-flex' }}><Icon name="more" size={16} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length > 20 && <div style={{ padding: '12px 16px', fontSize: 11.5, color: '#6B7280', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>Showing 20 of {filtered.length} users</div>}
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.name}` : ''} width={520}
        footer={<><Btn onClick={() => setSelected(null)}>Cancel</Btn><Btn kind="danger">Suspend</Btn><Btn kind="primary" onClick={() => { addToast('User updated'); setSelected(null); }}>Save</Btn></>}>
        {selected && (
          <div>
            <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#1A3260', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>{selected.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>{selected.designation}</div>
                <div style={{ fontSize: 11.5, marginTop: 4 }}><StatusBadge status={selected.status} /></div>
              </div>
            </div>
            {[
              ['Email', selected.email],
              ['Phone', selected.phone],
              ['Role', selected.roleLabel],
              ['Department', window.GMS.DEPARTMENTS.find(d => d.code === selected.dept).name],
              ['District', selected.district],
              ['Created', selected.created],
              ['Last login', selected.lastLogin],
              ['User ID', selected.id],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', padding: '7px 0', borderBottom: '1px solid #F3F4F6', fontSize: 12 }}>
                <div style={{ color: '#6B7280', fontWeight: 500 }}>{k}</div>
                <div style={{ color: '#0F1A2E' }}>{v}</div>
              </div>
            ))}
            {showAI && (
              <div style={{ marginTop: 14, padding: 11, background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: 8, fontSize: 11.5 }}>
                <AIBadge>AI Insight</AIBadge>
                <div style={{ marginTop: 6, lineHeight: 1.5, color: '#0F1A2E' }}>This user resolved 47 grievances last month, 18% above peer average. Promotion to <b>Senior Officer</b> may be appropriate.</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add New User" width={520}
        footer={<><Btn onClick={() => setShowCreate(false)}>Cancel</Btn><Btn kind="primary" onClick={() => { addToast('User created'); setShowCreate(false); }}>Create User</Btn></>}>
        <div style={{ display: 'grid', gap: 12 }}>
          {showAI && <div style={{ padding: 11, background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: 8, fontSize: 11.5, color: '#0F1A2E' }}><AIBadge>AI Suggest</AIBadge> Based on email domain, suggested role: <b>District Officer</b> · Dept: <b>Health & FW</b></div>}
          <FormRow label="Full Name *"><input style={inputStyle} placeholder="Mr. Suresh Patel" /></FormRow>
          <FormRow label="Email *"><input style={inputStyle} placeholder="suresh.patel@gujarat.gov.in" /></FormRow>
          <FormRow label="Phone"><input style={inputStyle} placeholder="+91 9XXXXXXXXX" /></FormRow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FormRow label="Role *"><select style={inputStyle}><option>Officer</option><option>District Admin</option><option>Department Admin</option></select></FormRow>
            <FormRow label="Department *"><select style={inputStyle}>{window.GMS.DEPARTMENTS.map(d => <option key={d.code}>{d.name}</option>)}</select></FormRow>
          </div>
          <FormRow label="District"><select style={inputStyle}><option>Ahmedabad</option><option>Surat</option><option>Vadodara</option><option>Rajkot</option></select></FormRow>
        </div>
      </Modal>

      <Modal open={showBulk} onClose={() => setShowBulk(false)} title="Bulk Upload Users" width={520}
        footer={<><Btn onClick={() => setShowBulk(false)}>Cancel</Btn><Btn kind="primary" onClick={() => { addToast('48 users imported, 2 skipped'); setShowBulk(false); }}>Upload 50 users</Btn></>}>
        <div style={{ padding: '22px 18px', border: '2px dashed #D1D5DB', borderRadius: 9, textAlign: 'center', background: '#F9FAFB', marginBottom: 12 }}>
          <div style={{ marginBottom: 8, color: '#9CA3AF' }}><Icon name="upload" size={30} /></div>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>Drop CSV file here</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>or <span style={{ color: '#FF8C42', fontWeight: 600, cursor: 'pointer' }}>browse files</span></div>
          <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 8 }}>Required columns: name, email, role, department, district</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 11, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 8 }}>
          <span style={{ display: 'flex', color: '#6B7280' }}><Icon name="document" size={18} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>users_april_batch.csv</div>
            <div style={{ fontSize: 10.5, color: '#6B7280' }}>50 rows · 4.2 KB</div>
          </div>
          <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="check" size={12} />Validated</span>
        </div>
        {showAI && <div style={{ padding: 11, background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: 8, fontSize: 11.5 }}><AIBadge>AI Validation</AIBadge><div style={{ marginTop: 5, lineHeight: 1.5 }}>2 rows have invalid email domains (not @gujarat.gov.in). 48 rows pass all validations and can be imported now.</div></div>}
      </Modal>
    </div>
  );
};

const inputStyle = { padding: '8px 11px', border: '1px solid #E5E7EB', borderRadius: 7, fontSize: 12, fontFamily: 'inherit', outline: 'none', background: '#fff', width: '100%' };

function FormRow({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

window.FormRow = FormRow;
window.inputStyle = inputStyle;

/* ═══════════════ PermCheckbox: small themed checkbox with stamp animation ═══════════════ */
(function injectPermCheckboxStyles() {
  if (document.getElementById('perm-checkbox-styles')) return;
  const s = document.createElement('style');
  s.id = 'perm-checkbox-styles';
  s.textContent = `
    .perm-cb { position: relative; width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid #CBD5E1; background: #fff; cursor: pointer; padding: 0; display: inline-flex; align-items: center; justify-content: center; transition: border-color .15s ease, background .15s ease, transform .15s ease; vertical-align: middle; }
    .perm-cb:hover { border-color: #0F1A2E; background: #F8FAFC; }
    .perm-cb:focus-visible { outline: 2px solid #FF8C42; outline-offset: 2px; }
    .perm-cb[data-checked="true"] { border-color: var(--cb, #0F1A2E); background: var(--cb, #0F1A2E); }
    .perm-cb[data-checked="true"]:hover { filter: brightness(1.08); }
    .perm-cb__svg { width: 11px; height: 11px; color: #fff; opacity: 0; transform: scale(.4); transition: opacity .14s ease, transform .14s cubic-bezier(.34,1.56,.64,1); }
    .perm-cb[data-checked="true"] .perm-cb__svg { opacity: 1; transform: scale(1); }
    .perm-cb__ring { position: absolute; inset: -2px; border-radius: 7px; border: 2px solid var(--cb, #0F1A2E); opacity: 0; pointer-events: none; }
    .perm-cb[data-anim="on"] { animation: permCbStamp .32s cubic-bezier(.34,1.56,.64,1); }
    .perm-cb[data-anim="on"] .perm-cb__ring { animation: permCbRing .42s ease-out; }
    @keyframes permCbStamp { 0% { transform: scale(1); } 35% { transform: scale(.82); } 70% { transform: scale(1.12); } 100% { transform: scale(1); } }
    @keyframes permCbRing { 0% { opacity: .55; transform: scale(.6); } 100% { opacity: 0; transform: scale(1.6); } }
  `;
  document.head.appendChild(s);
})();

window.PermCheckbox = function PermCheckbox({ checked, color, onChange, size = 18 }) {
  const [anim, setAnim] = useStateA(0);
  const handle = (e) => {
    setAnim(a => a + 1);
    onChange && onChange(e);
  };
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={!!checked}
      onClick={handle}
      onAnimationEnd={() => setAnim(0)}
      data-checked={checked ? 'true' : 'false'}
      data-anim={anim ? 'on' : 'off'}
      className="perm-cb"
      style={{ ['--cb']: color || '#0F1A2E', width: size, height: size }}
    >
      <span className="perm-cb__ring" key={anim} />
      <svg className="perm-cb__svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3.5 8.5 6.8 11.5 12.5 5" />
      </svg>
    </button>
  );
};

/* ═══════════════ M3: ROLES & PERMISSIONS ═══════════════ */
window.AdminRoles = function AdminRoles({ role: currentRole, addToast }) {
  const [roles] = useStateA(['SUPER', 'DEPT', 'DIST', 'OFFICER']);
  const [perms, setPerms] = useStateA(window.GMS.ROLE_PERMS);
  const [activeRole, setActiveRole] = useStateA('DEPT');

  const roleNames = { SUPER: 'Super Admin', DEPT: 'Department Admin', DIST: 'District Admin', OFFICER: 'Officer' };
  const roleColors = { SUPER: '#7C3AED', DEPT: '#DC2626', DIST: '#0EA5E9', OFFICER: '#16A34A' };

  const togglePerm = (modCode, level) => {
    const current = perms[activeRole][modCode] || [];
    const next = current.includes(level) ? current.filter(x => x !== level) : [...current, level];
    setPerms({ ...perms, [activeRole]: { ...perms[activeRole], [modCode]: next } });
    addToast(`${roleNames[activeRole]} ${next.includes(level) ? 'granted' : 'revoked'} ${level} on ${modCode}`);
  };

  return (
    <div>
      <PageHeader title="Roles & Permissions" sub="Granular permission matrix · 4 roles · 11 modules · 4 access levels" actions={<><Btn><Icon name="download" size={12} style={{marginRight:4}} />Export Matrix</Btn><Btn kind="primary"><Icon name="plus" size={12} style={{marginRight:4}} />New Role</Btn></>} />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 14 }}>
        <Card padding={12}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', letterSpacing: 0.5, padding: '4px 8px 8px', textTransform: 'uppercase' }}>Roles</div>
          {roles.map(r => (
            <button key={r} onClick={() => setActiveRole(r)} style={{ width: '100%', padding: '11px 12px', borderRadius: 7, border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, background: activeRole === r ? '#F9FAFB' : 'transparent', borderLeft: activeRole === r ? `3px solid ${roleColors[r]}` : '3px solid transparent', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 2 }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={r === 'SUPER' ? 'shield' : r === 'DEPT' ? 'building' : r === 'DIST' ? 'map' : 'user'} size={15} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0F1A2E' }}>{roleNames[r]}</div>
                <div style={{ fontSize: 10.5, color: '#6B7280' }}>{Object.values(perms[r] || {}).flat().length} permissions</div>
              </div>
            </button>
          ))}
        </Card>

        <Card padding={0}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={activeRole === 'SUPER' ? 'shield' : activeRole === 'DEPT' ? 'building' : activeRole === 'DIST' ? 'map' : 'user'} size={18} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{roleNames[activeRole]}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>Tap any cell to grant/revoke</div>
            </div>
            <Btn size="sm"><Icon name="settings" size={11} style={{marginRight:4}} />Settings</Btn>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10.5, fontWeight: 600, color: '#6B7280', letterSpacing: 0.5, textTransform: 'uppercase', width: '40%' }}>Module</th>
                {window.GMS.PERMISSION_LEVELS.map(lvl => <th key={lvl} style={{ padding: '10px', textAlign: 'center', fontSize: 10.5, fontWeight: 600, color: '#6B7280', letterSpacing: 0.5, textTransform: 'uppercase' }}>{lvl}</th>)}
              </tr>
            </thead>
            <tbody>
              {window.GMS.PERMISSIONS.map(mod => (
                <tr key={mod.code} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'flex', color: '#6B7280' }}><Icon name="folder" size={13} /></span>
                      <span style={{ fontWeight: 600, color: '#0F1A2E' }}>{mod.module}</span>
                    </span>
                  </td>
                  {window.GMS.PERMISSION_LEVELS.map(lvl => {
                    const has = (perms[activeRole][mod.code] || []).includes(lvl);
                    return (
                      <td key={lvl} style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <PermCheckbox checked={has} color={roleColors[activeRole]} onChange={() => togglePerm(mod.code, lvl)} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════ M4: HIERARCHY BUILDER ═══════════════ */
window.AdminHierarchy = function AdminHierarchy({ addToast, showAI }) {
  const [tree, setTree] = useStateA(window.GMS.HIERARCHY);
  const [selected, setSelected] = useStateA(null);

  const toggleNode = (id) => {
    const walk = (n) => ({ ...n, expanded: n.id === id ? !n.expanded : n.expanded, children: (n.children || []).map(walk) });
    setTree(walk(tree));
  };

  return (
    <div>
      <PageHeader title="Department & Hierarchy Builder" sub="Drag-drop to reorganize · State → Department → Office → Branch → Post → Employee" actions={<><Btn><Icon name="globe" size={12} style={{marginRight:4}} />Org Chart View</Btn><Btn><Icon name="plus" size={12} style={{marginRight:4}} />Add Node</Btn><Btn kind="primary"><Icon name="check" size={12} style={{marginRight:4}} />Save Structure</Btn></>} />

      {showAI && (
        <div style={{ padding: 12, background: 'linear-gradient(90deg, #FAF5FF, #fff)', border: '1px solid #E9D5FF', borderRadius: 9, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg, #7C3AED, #DB2777)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="sparkles" size={14} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>AI Hierarchy Optimizer</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Detected: <b>HFWD</b> Surat office has 0 sub-branches but 64 employees. Suggest splitting into 3 branches based on geography.</div>
          </div>
          <Btn size="sm">View Suggestion</Btn>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 14 }}>
        <Card padding={14}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #F3F4F6' }}>Organizational Tree</div>
          <TreeNode node={tree} depth={0} onToggle={toggleNode} onSelect={setSelected} selectedId={selected?.id} />
        </Card>

        <Card padding={16}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{selected ? 'Node Details' : 'Select a node'}</div>
          {!selected && <Empty icon="tree" label="No node selected" sub="Click any tree node to view & edit" />}
          {selected && (
            <div>
              {(() => {
                const meta = window.GMS.HIER_TYPE_META[selected.type] || { icon: 'folder', label: selected.type, color: '#6B7280' };
                const HIER_ICON_MAP = { STATE: 'map', DEPT: 'building', OFFICE: 'briefcase', BRANCH: 'folder', POST: 'badge', EMPLOYEE: 'user' };
                return (
                  <div style={{ display: 'flex', gap: 11, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 9, background: 'transparent', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={HIER_ICON_MAP[selected.type] || 'folder'} size={20} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{selected.name}</div>
                      <div style={{ fontSize: 11, color: meta.color, fontWeight: 600, marginTop: 2 }}>{meta.label}</div>
                    </div>
                  </div>
                );
              })()}
              {[
                ['Type', selected.type],
                ['Node ID', selected.id],
                ['Employees', selected.emp || (selected.type === 'EMPLOYEE' ? 1 : '—')],
                selected.deptCode && ['Dept Code', selected.deptCode],
                selected.designation && ['Designation', selected.designation],
                ['Children', (selected.children || []).length],
              ].filter(Boolean).map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', padding: '6px 0', fontSize: 11.5 }}>
                  <div style={{ color: '#6B7280', fontWeight: 500 }}>{k}</div>
                  <div style={{ color: '#0F1A2E', fontWeight: 500 }}>{v}</div>
                </div>
              ))}
              <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
                <Btn size="sm"><Icon name="plus" size={11} style={{marginRight:3}} />Child</Btn>
                <Btn size="sm"><Icon name="edit" size={11} style={{marginRight:3}} />Rename</Btn>
                <Btn size="sm" kind="danger"><Icon name="trash" size={11} style={{marginRight:3}} />Delete</Btn>
              </div>
              {selected.type === 'DEPT' && (
                <div style={{ marginTop: 12, padding: 11, background: '#F9FAFB', borderRadius: 7, fontSize: 11 }}>
                  <div style={{ fontWeight: 600, marginBottom: 5 }}>Mapped Categories</div>
                  {window.GMS.CATEGORIES.filter(c => c.dept === selected.deptCode).slice(0, 4).map(c => (
                    <div key={c.code} style={{ padding: '3px 0', color: '#374151' }}>• {c.name}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const HIER_ICON_MAP = { STATE: 'map', DEPT: 'building', OFFICE: 'briefcase', BRANCH: 'folder', POST: 'badge', EMPLOYEE: 'user' };

function TreeNode({ node, depth, onToggle, onSelect, selectedId }) {
  const meta = window.GMS.HIER_TYPE_META[node.type] || { icon: 'folder', color: '#6B7280', label: node.type };
  const hasChildren = (node.children || []).length > 0;
  const isSel = selectedId === node.id;
  return (
    <div>
      <div onClick={() => onSelect(node)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', paddingLeft: 8 + depth * 18, borderRadius: 5, cursor: 'pointer', background: isSel ? '#FFF7ED' : 'transparent', borderLeft: isSel ? '3px solid #FF8C42' : '3px solid transparent', fontSize: 12.5 }} onMouseEnter={e => !isSel && (e.currentTarget.style.background = '#FAFBFC')} onMouseLeave={e => !isSel && (e.currentTarget.style.background = 'transparent')}>
        <span onClick={(e) => { e.stopPropagation(); onToggle(node.id); }} style={{ width: 16, fontSize: 10, color: '#6B7280', userSelect: 'none', display: 'inline-flex', alignItems: 'center' }}>{hasChildren ? <Icon name={node.expanded ? 'chevronDown' : 'chevronRight'} size={11} /> : null}</span>
        <span style={{ display: 'flex', color: meta.color }}><Icon name={HIER_ICON_MAP[node.type] || 'folder'} size={14} /></span>
        <span style={{ flex: 1, fontWeight: isSel ? 600 : 500, color: '#0F1A2E' }}>{node.name}</span>
        <span style={{ fontSize: 9.5, padding: '1px 5px', background: 'transparent', color: '#374151', borderRadius: 3, fontWeight: 700, letterSpacing: 0.4 }}>{meta.label}</span>
        {node.emp && <span style={{ fontSize: 10, color: '#6B7280' }}>{node.emp}</span>}
      </div>
      {node.expanded && (node.children || []).map(c => <TreeNode key={c.id} node={c} depth={depth + 1} onToggle={onToggle} onSelect={onSelect} selectedId={selectedId} />)}
    </div>
  );
}
